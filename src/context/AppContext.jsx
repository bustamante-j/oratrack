import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { credentials, seedData } from '../data/mockData'
import { getRisk } from '../utils/risk'

const AppContext = createContext(null)

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue))
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue]
}

export function AppProvider({ children }) {
  const [user, setUser] = useStoredState('oratrack_user', null)
  const [students, setStudents] = useStoredState('oratrack_students', seedData.students)
  const [teachers, setTeachers] = useStoredState('oratrack_teachers', seedData.teachers)
  const [announcements, setAnnouncements] = useStoredState('oratrack_announcements', seedData.announcements)
  const [events, setEvents] = useStoredState('oratrack_events', seedData.events)
  const [transfers, setTransfers] = useStoredState('oratrack_transfers', seedData.transfers)
  const [attendance, setAttendance] = useStoredState('oratrack_attendance', seedData.attendance)
  const [settings, setSettings] = useStoredState('oratrack_settings', { displayName: '', density: 'comfortable' })

  useEffect(() => {
    const version = '2026-06-23-public-content-v2'
    if (localStorage.getItem('oratrack_data_version') === version) return
    setAnnouncements((current) => {
      const known = new Set(current.map((item) => item.id))
      return [...current, ...seedData.announcements.filter((item) => !known.has(item.id))].sort((a, b) => a.date.localeCompare(b.date))
    })
    setEvents((current) => {
      const known = new Set(current.map((item) => item.id))
      return [...current, ...seedData.events.filter((item) => !known.has(item.id))].sort((a, b) => a.date.localeCompare(b.date))
    })
    localStorage.setItem('oratrack_data_version', version)
  }, [setAnnouncements, setEvents])

  const login = (email, password) => {
    const match = credentials.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password)
    if (!match) return { ok: false, message: 'Email or password is incorrect. Use a demo account below.' }
    const safeUser = { email: match.email, role: match.role, name: match.name }
    setUser(safeUser)
    return { ok: true, user: safeUser }
  }

  const logout = () => setUser(null)

  const saveStudent = (student) => {
    const withRisk = { ...student, riskLevel: getRisk(student).level }
    setStudents((current) => {
      const exists = current.some((item) => item.studentId === student.studentId)
      return exists ? current.map((item) => item.studentId === student.studentId ? withRisk : item) : [withRisk, ...current]
    })
  }

  const resetDemo = () => {
    setStudents(seedData.students)
    setTeachers(seedData.teachers)
    setAnnouncements(seedData.announcements)
    setEvents(seedData.events)
    setTransfers(seedData.transfers)
    setAttendance(seedData.attendance)
    setSettings({ displayName: '', density: 'comfortable' })
  }

  const value = useMemo(() => ({
    user, login, logout,
    students, setStudents, saveStudent,
    teachers, setTeachers,
    announcements, setAnnouncements,
    events, setEvents,
    transfers, setTransfers,
    attendance, setAttendance,
    settings, setSettings,
    resetDemo,
  }), [user, students, teachers, announcements, events, transfers, attendance, settings])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
