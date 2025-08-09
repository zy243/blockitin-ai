import React, { useState } from 'react'
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const AttendanceLog: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState('all')
  
  const courses = [
    { id: 'cs101', name: 'Introduction to AI', code: 'CS 101' },
    { id: 'cs201', name: 'Blockchain Development', code: 'CS 201' },
    { id: 'math301', name: 'Advanced Calculus', code: 'MATH 301' },
  ]

  const attendanceRecords = [
    {
      id: 1,
      course: 'Introduction to AI',
      courseCode: 'CS 101',
      date: '2023-10-20',
      time: '10:00 AM',
      location: 'Room 301',
      status: 'present',
      verificationMethod: 'QR Code'
    },
    {
      id: 2,
      course: 'Blockchain Development',
      courseCode: 'CS 201',
      date: '2023-10-20',
      time: '2:00 PM',
      location: 'Lab 2',
      status: 'present',
      verificationMethod: 'Biometric'
    },
    {
      id: 3,
      course: 'Advanced Calculus',
      courseCode: 'MATH 301',
      date: '2023-10-19',
      time: '9:00 AM',
      location: 'Room 105',
      status: 'absent',
      verificationMethod: '-'
    },
    {
      id: 4,
      course: 'Introduction to AI',
      courseCode: 'CS 101',
      date: '2023-10-18',
      time: '10:00 AM',
      location: 'Room 301',
      status: 'late',
      verificationMethod: 'Manual'
    }
  ]

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'late':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      present: 'bg-green-100 text-green-700',
      absent: 'bg-red-100 text-red-700',
      late: 'bg-yellow-100 text-yellow-700'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const exportCSV = () => {
    const headers = ['Course','Date','Time','Location','Status']
    const csv = [headers.join(','), ...attendanceRecords.map(r => [r.course, r.date, r.time, r.location, r.status].join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const locationCheckIn = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported')
      return
    }
    navigator.geolocation.getCurrentPosition(() => {
      alert('Location verified and check-in recorded!')
    }, () => {
      alert('Unable to retrieve location.')
    })
  }

  const attendanceStats = {
    total: 40,
    present: 35,
    absent: 3,
    late: 2,
    percentage: 87.5
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Attendance Log</h2>
        <p className="text-gray-600 mt-1">Track and verify your class attendance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Classes</span>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{attendanceStats.total}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Present</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{attendanceStats.present}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Absent</span>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{attendanceStats.absent}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Attendance Rate</span>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-700 font-bold text-sm">{attendanceStats.percentage}%</span>
            </div>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${attendanceStats.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filter and Records */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
              <button
                onClick={exportCSV}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{record.course}</p>
                      <p className="text-sm text-gray-500">{record.courseCode}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">{record.date}</p>
                        <p className="text-sm text-gray-500">{record.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{record.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      {getStatusBadge(record.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{record.verificationMethod}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">Mark Your Attendance</h3>
        <p className="mb-4 opacity-90">Use one of these methods to verify your presence in class</p>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <button
            onClick={locationCheckIn}
            className="bg-white/20 backdrop-blur rounded-lg p-4 hover:bg-white/30 transition-colors"
          >
            <div className="text-2xl mb-2">📍</div>
            <p className="font-medium">Location Check-in</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AttendanceLog
