import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useApp } from './context/AppContext'
import PublicLayout from './layouts/PublicLayout'
import PortalLayout from './layouts/PortalLayout'
import { HomePage, AboutPage, PublicAnnouncementsPage, PublicEventsPage, ProgramsPage, ContactPage } from './pages/public/PublicPages'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/portal/DashboardPage'
import StudentRecordsPage from './pages/portal/StudentRecordsPage'
import { PerformancePage, AttendancePage } from './pages/portal/PerformanceAttendancePages'
import { ReportsPage, TransfersPage } from './pages/portal/ReportsTransfersPages'
import { AnalyticsPage, FlaggingPage } from './pages/portal/AnalyticsFlaggingPages'
import { ManageAnnouncementsPage, ManageEventsPage } from './pages/portal/CommunicationPages'
import { TeachersPage, AIAssistantPage, SettingsPage } from './pages/portal/AdminSupportPages'

function ProtectedRoute({ children }) {
  const { user } = useApp()
  const location = useLocation()
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />
}

function RoleRoute({ roles, children }) {
  const { user } = useApp()
  return roles.includes(user?.role) ? children : <Navigate to="/portal/dashboard" replace />
}

export default function App() {
  const { user } = useApp()
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/announcements" element={<PublicAnnouncementsPage />} />
        <Route path="/events" element={<PublicEventsPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      <Route path="/login" element={user ? <Navigate to="/portal/dashboard" replace /> : <LoginPage />} />
      <Route path="/portal" element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="students" element={<RoleRoute roles={['Admin', 'Adviser']}><StudentRecordsPage /></RoleRoute>} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="transfers" element={<RoleRoute roles={['Admin']}><TransfersPage /></RoleRoute>} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="flagging" element={<RoleRoute roles={['Admin', 'Adviser']}><FlaggingPage /></RoleRoute>} />
        <Route path="announcements" element={<RoleRoute roles={['Admin', 'Adviser']}><ManageAnnouncementsPage /></RoleRoute>} />
        <Route path="events" element={<RoleRoute roles={['Admin', 'Adviser']}><ManageEventsPage /></RoleRoute>} />
        <Route path="teachers" element={<RoleRoute roles={['Admin']}><TeachersPage /></RoleRoute>} />
        <Route path="ai-assistant" element={<AIAssistantPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
