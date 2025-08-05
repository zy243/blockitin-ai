import React, { useState } from 'react'
import { Plus, GraduationCap, Calendar, Award, Edit2, Trash2, Download, Share2, FileText, Table } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

interface AcademicResult {
  id: string
  semester: string
  year: string
  course: string
  courseCode: string
  credits: number
  grade: string
  gpa: number
  professor: string
  dateCompleted: string
  resultType: 'course' | 'semester' | 'final'
}

const AcademicResults: React.FC = () => {
  const [results, setResults] = useState<AcademicResult[]>([
    {
      id: '1',
      semester: 'Fall',
      year: '2023',
      course: 'Advanced Machine Learning',
      courseCode: 'CS 7641',
      credits: 3,
      grade: 'A',
      gpa: 4.0,
      professor: 'Dr. Sarah Johnson',
      dateCompleted: '2023-12-15',
      resultType: 'course'
    },
    {
      id: '2',
      semester: 'Fall',
      year: '2023',
      course: 'Computer Vision',
      courseCode: 'CS 7643',
      credits: 3,
      grade: 'A-',
      gpa: 3.7,
      professor: 'Dr. Michael Chen',
      dateCompleted: '2023-12-18',
      resultType: 'course'
    },
    {
      id: '3',
      semester: 'Spring',
      year: '2024',
      course: 'Natural Language Processing',
      courseCode: 'CS 7650',
      credits: 3,
      grade: 'B+',
      gpa: 3.3,
      professor: 'Dr. Emily Rodriguez',
      dateCompleted: '2024-05-10',
      resultType: 'course'
    }
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingResult, setEditingResult] = useState<AcademicResult | null>(null)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [formData, setFormData] = useState<Partial<AcademicResult>>({
    semester: '',
    year: '',
    course: '',
    courseCode: '',
    credits: 0,
    grade: '',
    gpa: 0,
    professor: '',
    dateCompleted: '',
    resultType: 'course'
  })

  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F']
  const semesterOptions = ['Spring', 'Summer', 'Fall', 'Winter']
  const resultTypeOptions = [
    { value: 'course', label: 'Individual Course' },
    { value: 'semester', label: 'Semester Summary' },
    { value: 'final', label: 'Final Transcript' }
  ]

  const handleInputChange = (field: keyof AcademicResult, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-calculate GPA based on grade
    if (field === 'grade') {
      const gpaMap: { [key: string]: number } = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'F': 0.0
      }
      setFormData(prev => ({ ...prev, gpa: gpaMap[value as string] || 0 }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingResult) {
      // Update existing result
      setResults(prev => prev.map(result => 
        result.id === editingResult.id 
          ? { ...result, ...formData } as AcademicResult
          : result
      ))
      setEditingResult(null)
    } else {
      // Create new result
      const newResult: AcademicResult = {
        id: Date.now().toString(),
        ...formData
      } as AcademicResult
      
      setResults(prev => [...prev, newResult])
    }
    
    // Reset form
    setFormData({
      semester: '',
      year: '',
      course: '',
      courseCode: '',
      credits: 0,
      grade: '',
      gpa: 0,
      professor: '',
      dateCompleted: '',
      resultType: 'course'
    })
    setShowCreateForm(false)
  }

  const handleEdit = (result: AcademicResult) => {
    setEditingResult(result)
    setFormData(result)
    setShowCreateForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this academic result?')) {
      setResults(prev => prev.filter(result => result.id !== id))
    }
  }

  const calculateOverallGPA = () => {
    if (results.length === 0) return 0
    const totalPoints = results.reduce((sum, result) => sum + (result.gpa * result.credits), 0)
    const totalCredits = results.reduce((sum, result) => sum + result.credits, 0)
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00'
  }

  const getTotalCredits = () => {
    return results.reduce((sum, result) => sum + result.credits, 0)
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50'
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50'
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50'
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  // Download as CSV
  const downloadCSV = () => {
    const headers = ['Course', 'Course Code', 'Semester', 'Year', 'Credits', 'Grade', 'GPA', 'Professor', 'Date Completed', 'Result Type']
    const csvContent = [
      headers.join(','),
      ...results.map(result => [
        `"${result.course}"`,
        result.courseCode,
        result.semester,
        result.year,
        result.credits,
        result.grade,
        result.gpa,
        `"${result.professor}"`,
        result.dateCompleted,
        result.resultType
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `academic-results-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowDownloadMenu(false)
  }

  // Download as PDF
  const downloadPDF = () => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.setTextColor(79, 70, 229) // Indigo color
    doc.text('Academic Results Report', 20, 30)
    
    // Student info
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45)
    doc.text(`Overall GPA: ${calculateOverallGPA()}`, 20, 55)
    doc.text(`Total Credits: ${getTotalCredits()}`, 20, 65)
    doc.text(`Total Courses: ${results.length}`, 20, 75)
    
    // Table data
    const tableData = results.map(result => [
      result.course,
      result.courseCode,
      `${result.semester} ${result.year}`,
      result.credits.toString(),
      result.grade,
      result.gpa.toFixed(1),
      result.professor,
      new Date(result.dateCompleted).toLocaleDateString()
    ])

    // Create table
    doc.autoTable({
      head: [['Course', 'Code', 'Semester', 'Credits', 'Grade', 'GPA', 'Professor', 'Completed']],
      body: tableData,
      startY: 85,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [79, 70, 229], // Indigo color
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // Light gray
      },
      columnStyles: {
        0: { cellWidth: 35 }, // Course
        1: { cellWidth: 20 }, // Code
        2: { cellWidth: 25 }, // Semester
        3: { cellWidth: 15 }, // Credits
        4: { cellWidth: 15 }, // Grade
        5: { cellWidth: 15 }, // GPA
        6: { cellWidth: 30 }, // Professor
        7: { cellWidth: 25 }  // Completed
      }
    })

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10)
      doc.text('Generated by Blockitin AI', 20, doc.internal.pageSize.height - 10)
    }

    doc.save(`academic-results-${new Date().toISOString().split('T')[0]}.pdf`)
    setShowDownloadMenu(false)
  }

  // Download individual result
  const downloadIndividualResult = (result: AcademicResult) => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.setTextColor(79, 70, 229)
    doc.text('Course Result Certificate', 20, 30)
    
    // Course details
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text(`Course: ${result.course}`, 20, 60)
    doc.text(`Course Code: ${result.courseCode}`, 20, 75)
    doc.text(`Semester: ${result.semester} ${result.year}`, 20, 90)
    doc.text(`Credits: ${result.credits}`, 20, 105)
    doc.text(`Grade: ${result.grade}`, 20, 120)
    doc.text(`GPA: ${result.gpa.toFixed(1)}`, 20, 135)
    doc.text(`Professor: ${result.professor}`, 20, 150)
    doc.text(`Date Completed: ${new Date(result.dateCompleted).toLocaleDateString()}`, 20, 165)
    
    // Footer
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(`Generated on ${new Date().toLocaleDateString()} by Blockitin AI`, 20, 280)
    
    doc.save(`${result.courseCode}-${result.course.replace(/\s+/g, '-')}.pdf`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Academic Results</h2>
          <p className="text-gray-600">Manage and track your academic performance</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Download Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
            
            {showDownloadMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2">
                  <button
                    onClick={downloadPDF}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4 text-red-500" />
                    <span>Download as PDF</span>
                  </button>
                  <button
                    onClick={downloadCSV}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                  >
                    <Table className="w-4 h-4 text-green-500" />
                    <span>Download as CSV</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Result</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{calculateOverallGPA()}</span>
          </div>
          <p className="text-gray-600 text-sm">Overall GPA</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{getTotalCredits()}</span>
          </div>
          <p className="text-gray-600 text-sm">Total Credits</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{results.length}</span>
          </div>
          <p className="text-gray-600 text-sm">Completed Courses</p>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Academic Records</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{result.course}</div>
                      <div className="text-sm text-gray-500">{result.courseCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.semester} {result.year}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.credits}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.gpa.toFixed(1)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.professor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(result)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                        title="Edit result"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(result.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete result"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => downloadIndividualResult(result)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Download individual result"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1 rounded" title="Share result">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingResult ? 'Edit Academic Result' : 'Add New Academic Result'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                  <input
                    type="text"
                    value={formData.course || ''}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
                  <input
                    type="text"
                    value={formData.courseCode || ''}
                    onChange={(e) => handleInputChange('courseCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                  <select
                    value={formData.semester || ''}
                    onChange={(e) => handleInputChange('semester', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Semester</option>
                    {semesterOptions.map(semester => (
                      <option key={semester} value={semester}>{semester}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="text"
                    value={formData.year || ''}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="2024"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                  <input
                    type="number"
                    value={formData.credits || ''}
                    onChange={(e) => handleInputChange('credits', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1"
                    max="6"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                  <select
                    value={formData.grade || ''}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Grade</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professor</label>
                  <input
                    type="text"
                    value={formData.professor || ''}
                    onChange={(e) => handleInputChange('professor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Completed</label>
                  <input
                    type="date"
                    value={formData.dateCompleted || ''}
                    onChange={(e) => handleInputChange('dateCompleted', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Result Type</label>
                <select
                  value={formData.resultType || 'course'}
                  onChange={(e) => handleInputChange('resultType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {resultTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingResult(null)
                    setFormData({
                      semester: '',
                      year: '',
                      course: '',
                      courseCode: '',
                      credits: 0,
                      grade: '',
                      gpa: 0,
                      professor: '',
                      dateCompleted: '',
                      resultType: 'course'
                    })
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingResult ? 'Update Result' : 'Save Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Click outside to close download menu */}
      {showDownloadMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowDownloadMenu(false)}
        />
      )}
    </div>
  )
}

export default AcademicResults
