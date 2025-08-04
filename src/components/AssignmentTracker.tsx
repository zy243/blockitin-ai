import React, { useState } from 'react'
import { ClipboardList, Clock, Calendar, AlertCircle, CheckCircle, FileText, Upload, Filter } from 'lucide-react'

const AssignmentTracker: React.FC = () => {
  const [filter, setFilter] = useState('all')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  const assignments = [
    {
      id: 1,
      title: 'Machine Learning Final Project',
      course: 'CS 101 - Introduction to AI',
      dueDate: '2023-10-25',
      dueTime: '11:59 PM',
      status: 'in-progress',
      progress: 65,
      priority: 'high',
      description: 'Implement a neural network for image classification',
      attachments: 2
    },
    {
      id: 2,
      title: 'Blockchain Smart Contract Development',
      course: 'CS 201 - Blockchain Development',
      dueDate: '2023-10-23',
      dueTime: '5:00 PM',
      status: 'not-started',
      progress: 0,
      priority: 'urgent',
      description: 'Create a DeFi smart contract with staking functionality',
      attachments: 1
    },
    {
      id: 3,
      title: 'Calculus Problem Set #8',
      course: 'MATH 301 - Advanced Calculus',
      dueDate: '2023-10-22',
      dueTime: '9:00 AM',
      status: 'completed',
      progress: 100,
      priority: 'medium',
      description: 'Complete exercises 1-20 from Chapter 8',
      attachments: 0
    },
    {
      id: 4,
      title: 'Research Paper: AI Ethics',
      course: 'CS 101 - Introduction to AI',
      dueDate: '2023-10-28',
      dueTime: '11:59 PM',
      status: 'in-progress',
      progress: 30,
      priority: 'medium',
      description: '10-page paper on ethical considerations in AI development',
      attachments: 3
    }
  ]

  const getDaysUntilDue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'not-started':
        return <AlertCircle className="w-5 h-5 text-gray-400" />
      default:
        return null
    }
  }

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true
    return assignment.status === filter
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Assignment Tracker</h2>
          <p className="text-gray-600 mt-1">Manage your coursework and deadlines</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Submit Assignment</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Assignments</span>
            <ClipboardList className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{assignments.length}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Due This Week</span>
            <Calendar className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">3</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">In Progress</span>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">2</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Completed</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">1</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <div className="flex space-x-2">
          {['all', 'not-started', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const daysUntilDue = getDaysUntilDue(assignment.dueDate)
          
          return (
            <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(assignment.status)}
                    <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(assignment.priority)}`}>
                      {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{assignment.course}</p>
                  <p className="text-gray-700 text-sm mb-4">{assignment.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Due: {assignment.dueDate} at {assignment.dueTime}</span>
                    </div>
                    {assignment.attachments > 0 && (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{assignment.attachments} attachments</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right ml-6">
                  <div className={`text-2xl font-bold mb-1 ${
                    daysUntilDue < 0 ? 'text-red-600' :
                    daysUntilDue <= 2 ? 'text-orange-600' :
                    daysUntilDue <= 7 ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {daysUntilDue < 0 ? 'Overdue' : `${daysUntilDue} days`}
                  </div>
                  <p className="text-sm text-gray-500">until due</p>
                </div>
              </div>

              {/* Progress Bar */}
              {assignment.status !== 'not-started' && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{assignment.progress}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        assignment.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${assignment.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {assignment.status === 'completed' ? (
                  <button className="flex-1 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors">
                    View Submission
                  </button>
                ) : (
                  <>
                    <button className="flex-1 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors">
                      Continue Working
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedAssignment(assignment)
                        setShowSubmitModal(true)
                      }}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Submit Assignment
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit Assignment</h3>
            
            <div className="mb-4">
              <p className="text-gray-700 font-medium">{selectedAssignment?.title}</p>
              <p className="text-sm text-gray-600">{selectedAssignment?.course}</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop your files here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Browse Files
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                Your submission will be recorded on the blockchain for permanent verification.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Submit to Blockchain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssignmentTracker
