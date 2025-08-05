import React, { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  section: string
  description: string
  type: 'page' | 'item' | 'action'
}

interface SearchBarProps {
  onNavigate: (section: string, itemId?: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Comprehensive search data
  const searchData: SearchResult[] = [
    // Dashboard items
    { id: 'dashboard-overview', title: 'Dashboard Overview', section: 'dashboard', description: 'Main dashboard with stats and activity', type: 'page' },
    { id: 'dashboard-stats', title: 'Academic Statistics', section: 'dashboard', description: 'NFT credentials, resume views, health records', type: 'item' },
    { id: 'dashboard-activity-1', title: 'Computer Science Degree NFT', section: 'dashboard', description: 'Recently minted credential', type: 'item' },
    { id: 'dashboard-activity-2', title: 'COVID-19 Vaccination Record', section: 'dashboard', description: 'Health record upload', type: 'item' },
    
    // Credentials
    { id: 'credentials', title: 'NFT Credentials', section: 'credentials', description: 'Manage blockchain-verified academic credentials', type: 'page' },
    { id: 'credential-cs-degree', title: 'Computer Science Degree', section: 'credentials', description: 'Bachelor of Science in Computer Science', type: 'item' },
    { id: 'credential-ai-cert', title: 'AI Certification', section: 'credentials', description: 'Advanced AI and Machine Learning Certificate', type: 'item' },
    
    // Resume Builder
    { id: 'resume', title: 'AI Resume Builder', section: 'resume', description: 'Create and customize your professional resume', type: 'page' },
    { id: 'resume-personal', title: 'Personal Information', section: 'resume', description: 'Contact details and basic info', type: 'item' },
    { id: 'resume-experience', title: 'Work Experience', section: 'resume', description: 'Professional experience and internships', type: 'item' },
    
    // Academic Results
    { id: 'results', title: 'Academic Results', section: 'results', description: 'Track grades, GPA, and course performance', type: 'page' },
    { id: 'results-gpa', title: 'Overall GPA', section: 'results', description: 'Current cumulative grade point average', type: 'item' },
    { id: 'results-courses', title: 'Course Grades', section: 'results', description: 'Individual course results and transcripts', type: 'item' },
    
    // Health Passport
    { id: 'health', title: 'Health Passport', section: 'health', description: 'Secure health records and vaccination status', type: 'page' },
    { id: 'health-vaccination', title: 'Vaccination Records', section: 'health', description: 'COVID-19 and other vaccination certificates', type: 'item' },
    { id: 'health-medical', title: 'Medical Records', section: 'health', description: 'Health checkups and medical documents', type: 'item' },
    
    // Wellness Tracker
    { id: 'wellness', title: 'Wellness Tracker', section: 'wellness', description: 'Monitor mental health and daily wellness', type: 'page' },
    { id: 'wellness-mood', title: 'Mood Tracking', section: 'wellness', description: 'Daily mood and emotional wellbeing', type: 'item' },
    { id: 'wellness-goals', title: 'Wellness Goals', section: 'wellness', description: 'Personal health and fitness objectives', type: 'item' },
    
    // Attendance
    { id: 'attendance', title: 'Attendance Log', section: 'attendance', description: 'Track class attendance and participation', type: 'page' },
    { id: 'attendance-today', title: 'Today\'s Classes', section: 'attendance', description: 'Current day attendance status', type: 'item' },
    { id: 'attendance-stats', title: 'Attendance Statistics', section: 'attendance', description: 'Overall attendance percentage', type: 'item' },
    
    // Academic Publishing
    { id: 'publishing', title: 'Academic Publishing', section: 'publishing', description: 'Manage research papers and publications', type: 'page' },
    { id: 'publishing-papers', title: 'Research Papers', section: 'publishing', description: 'Published and draft research papers', type: 'item' },
    { id: 'publishing-citations', title: 'Citation Metrics', section: 'publishing', description: 'Publication impact and citations', type: 'item' },
    
    // Assignments
    { id: 'assignments', title: 'Assignment Tracker', section: 'assignments', description: 'Track homework, projects, and deadlines', type: 'page' },
    { id: 'assignments-pending', title: 'Pending Assignments', section: 'assignments', description: 'Upcoming and overdue assignments', type: 'item' },
    { id: 'assignments-completed', title: 'Completed Work', section: 'assignments', description: 'Finished assignments and grades', type: 'item' },
    
    // Campus Map
    { id: 'campus-map', title: 'Campus Map', section: 'campus-map', description: 'Interactive campus navigation and locations', type: 'page' },
    { id: 'campus-buildings', title: 'Campus Buildings', section: 'campus-map', description: 'Academic and administrative buildings', type: 'item' },
    { id: 'campus-events', title: 'Campus Events', section: 'campus-map', description: 'Upcoming events and activities', type: 'item' },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    
    if (searchQuery.trim() === '') {
      setResults([])
      setIsOpen(false)
      return
    }

    const filteredResults = searchData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.section.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8) // Limit to 8 results

    setResults(filteredResults)
    setIsOpen(true)
  }

  const handleResultClick = (result: SearchResult) => {
    onNavigate(result.section, result.id)
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'page': return '📄'
      case 'item': return '📋'
      case 'action': return '⚡'
      default: return '🔍'
    }
  }

  const getSectionColor = (section: string) => {
    const colors: { [key: string]: string } = {
      dashboard: 'bg-blue-100 text-blue-800',
      credentials: 'bg-purple-100 text-purple-800',
      resume: 'bg-green-100 text-green-800',
      results: 'bg-yellow-100 text-yellow-800',
      health: 'bg-red-100 text-red-800',
      wellness: 'bg-pink-100 text-pink-800',
      attendance: 'bg-indigo-100 text-indigo-800',
      publishing: 'bg-orange-100 text-orange-800',
      assignments: 'bg-teal-100 text-teal-800',
      'campus-map': 'bg-gray-100 text-gray-800',
    }
    return colors[section] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search dashboard, credentials, health records..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2 border-b border-gray-100">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </div>
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg mt-0.5">{getResultIcon(result.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </h4>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getSectionColor(result.section)}`}>
                        {result.section.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {result.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 text-center">
            <div className="text-gray-400 mb-2">🔍</div>
            <p className="text-sm text-gray-500">No results found for "{query}"</p>
            <p className="text-xs text-gray-400 mt-1">Try searching for credentials, health, assignments, or campus</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
