import React from 'react'
import { 
  Home, 
  Award, 
  FileText, 
  Heart, 
  Smile, 
  Calendar, 
  BookOpen,
  ClipboardList,
  Map,
  X
} from 'lucide-react'

interface SidebarProps {
  currentView: string
  setCurrentView: (view: any) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'credentials', label: 'Credentials', icon: Award },
    { id: 'resume', label: 'AI Resume', icon: FileText },
    { id: 'health', label: 'Health Passport', icon: Heart },
    { id: 'wellness', label: 'Wellness', icon: Smile },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'publishing', label: 'Publishing', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'campus-map', label: 'Campus Map', icon: Map },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-600 to-purple-700 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Blockitin</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id)
                  setIsOpen(false)
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                  ${currentView === item.id 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-white/80 text-sm">Student ID</p>
            <p className="text-white font-mono text-xs mt-1">0x1234...5678</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
