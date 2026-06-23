import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { credentials, seedData } from '../data/mockData'
import { getRisk } from '../utils/risk'
import { runLocalAgent } from '../utils/agentEngine'

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
  const [agentMessages, setAgentMessages] = useStoredState('oratrack_agent_messages', [
    { id: 'welcome', role: 'assistant', text: 'Hello! I’m ORA, your ORATRACK agent. I can analyze every demo record, draft school work, and prepare data changes for your review.', mode: 'local', createdAt: new Date().toISOString() },
  ])
  const [agentActions, setAgentActions] = useStoredState('oratrack_agent_actions', [])
  const [agentAudit, setAgentAudit] = useStoredState('oratrack_agent_audit', [])
  const [agentBusy, setAgentBusy] = useState(false)

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

  const dataSnapshot = () => ({ students, teachers, announcements, events, transfers, attendance })

  const askAgent = async (text) => {
    const message = text.trim()
    if (!message || agentBusy) return
    const userMessage = { id: `user-${Date.now()}`, role: 'user', text: message, createdAt: new Date().toISOString() }
    setAgentMessages((current) => [...current, userMessage])
    setAgentBusy(true)

    let result
    try {
      try {
        const remote = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            user,
            data: dataSnapshot(),
            history: agentMessages.slice(-8),
          }),
        })
        if (!remote.ok) throw new Error('Remote agent unavailable')
        result = await remote.json()
      } catch {
        result = runLocalAgent(message, dataSnapshot())
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: result.message,
        mode: result.mode || 'local',
        model: result.model,
        createdAt: new Date().toISOString(),
      }
      setAgentMessages((current) => [...current, assistantMessage])
      if (result.actions?.length) setAgentActions((current) => [...result.actions, ...current])
      setAgentAudit((current) => [{
        id: `audit-${Date.now()}`,
        type: 'query',
        label: message,
        detail: `${result.mode === 'openai' ? 'OpenAI agent' : 'Local agent'} response`,
        createdAt: new Date().toISOString(),
      }, ...current].slice(0, 50))
      return result
    } finally {
      setAgentBusy(false)
    }
  }

  const resolveStudent = (targetId) => students.find((student) =>
    student.studentId === targetId || student.name.toLowerCase().includes(String(targetId).toLowerCase()),
  )

  const executeAgentAction = (action) => {
    const payload = action.payload || {}
    const student = resolveStudent(action.target_id)
    let detail = action.summary
    if (action.type === 'create_announcement') {
      setAnnouncements((current) => [{ id: `A-${Date.now()}`, ...payload }, ...current])
    } else if (action.type === 'create_event') {
      setEvents((current) => [...current, { id: `E-${Date.now()}`, ...payload }].sort((a, b) => a.date.localeCompare(b.date)))
    } else if (action.type === 'update_grade' && student) {
      const updated = { ...student, grades: { ...student.grades, [payload.subject]: Number(payload.grade) } }
      setStudents((current) => current.map((item) => item.studentId === student.studentId ? { ...updated, riskLevel: getRisk(updated).level } : item))
    } else if (action.type === 'mark_attendance' && student) {
      setAttendance((current) => {
        const matches = (item) => item.studentId === student.studentId && item.date === payload.date
        const record = { studentId: student.studentId, name: student.name, gradeLevel: student.gradeLevel, section: student.section, date: payload.date, status: payload.status }
        return current.some(matches) ? current.map((item) => matches(item) ? record : item) : [record, ...current]
      })
    } else if (action.type === 'add_behavior_note' && student) {
      setStudents((current) => current.map((item) => {
        if (item.studentId !== student.studentId) return item
        const updated = {
          ...item,
          behaviorNotes: `${item.behaviorNotes}${item.behaviorNotes ? ' ' : ''}${payload.note}`,
        }
        return { ...updated, riskLevel: getRisk(updated).level }
      }))
    } else if (action.type === 'update_student_status' && student) {
      setStudents((current) => current.map((item) => item.studentId === student.studentId ? { ...item, status: payload.status } : item))
    } else {
      return { ok: false, message: 'This action could not be applied because its target or data is incomplete.' }
    }
    setAgentActions((current) => current.map((item) => item.id === action.id ? { ...item, status: 'applied', appliedAt: new Date().toISOString() } : item))
    setAgentAudit((current) => [{
      id: `audit-${Date.now()}`,
      type: 'action',
      label: action.type.replaceAll('_', ' '),
      detail,
      createdAt: new Date().toISOString(),
    }, ...current].slice(0, 50))
    return { ok: true, message: 'The change was applied to the demo data.' }
  }

  const dismissAgentAction = (actionId) => {
    setAgentActions((current) => current.map((item) => item.id === actionId ? { ...item, status: 'dismissed' } : item))
  }

  const clearAgentConversation = () => {
    setAgentMessages([{ id: `welcome-${Date.now()}`, role: 'assistant', text: 'Conversation cleared. What would you like me to analyze or update?', mode: 'local', createdAt: new Date().toISOString() }])
    setAgentActions([])
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
    agentMessages, agentActions, agentAudit, agentBusy,
    askAgent, executeAgentAction, dismissAgentAction, clearAgentConversation,
    resetDemo,
  }), [user, students, teachers, announcements, events, transfers, attendance, settings, agentMessages, agentActions, agentAudit, agentBusy])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
