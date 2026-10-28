import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AdmissionPage from './pages/AdmissionPage'
import MediaPage from './pages/MediaPage'
import ResultsPage from './pages/ResultsPage'
import LoginPage from './pages/LoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMedia from './pages/admin/AdminMedia'
import AdminStudents from './pages/admin/AdminStudents'
import AdminResults from './pages/admin/AdminResults'
import './index.css'

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public School Website */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="admission" element={<AdmissionPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="results" element={<ResultsPage />} />
          </Route>

          {/* Staff / Admin Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected CMS Admin Portal */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="results" element={<AdminResults />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
