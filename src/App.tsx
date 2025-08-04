import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Credentials from './components/Credentials'
import ResumeBuilder from './components/ResumeBuilder'
import HealthPassport from './components/HealthPassport'
import WellnessTracker from './components/WellnessTracker'
import AttendanceLog from './components/AttendanceLog'
import AcademicPublishing from './components/AcademicPublishing'
import AssignmentTracker from './components/AssignmentTracker'
import CampusMap from './components/CampusMap'
import WalletConnect from './components/WalletConnect'

type View = 'dashboard' | 'credentials' | 'resume' | 'health' | 'wellness' | 'attendance' | 'publishing' | 'assignments' | 'campus-map'

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'credentials':
        return <Credentials />
      case 'resume':
        return <ResumeBuilder />
      case 'health':
        return <HealthPassport />
      case 'wellness':
        return <WellnessTracker />
      case 'attendance':
        return <AttendanceLog />
      case 'publishing':
        return <AcademicPublishing />
      case 'assignments':
        return <AssignmentTracker />
      case 'campus-map':
        return <CampusMap />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Blockitin AI</h1>
            <WalletConnect />
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  )
}

export default App
