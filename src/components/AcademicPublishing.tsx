import React, { useState, useRef } from 'react'
import { BookOpen, Upload, Award, TrendingUp, FileText, ExternalLink, Shield } from 'lucide-react'

const AcademicPublishing: React.FC = () => {
  const openPaper = (pub: typeof publications[0]) => {
    if (pub.doi) {
      window.open(`https://doi.org/${pub.doi}`, '_blank')
    } else {
      alert('Full paper not available yet.')
    }
  }
  const sharePublication = (pub: typeof publications[0]) => {
    const shareText = `${pub.title} (${pub.type})`
    if (navigator.share) {
      navigator.share({ title: pub.title, text: shareText, url: window.location.href })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Share info copied to clipboard')
    }
  }
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadFileName, setUploadFileName] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  
  const publications = [
    {
      id: 1,
      title: 'Machine Learning Applications in Blockchain Security',
      type: 'Research Paper',
      date: '2023-09-15',
      originalityScore: 94,
      citations: 12,
      status: 'published',
      doi: '10.1234/blockchain-ml-2023'
    },
    {
      id: 2,
      title: 'Decentralized Identity Management Systems: A Comprehensive Review',
      type: 'Literature Review',
      date: '2023-08-20',
      originalityScore: 89,
      citations: 8,
      status: 'published',
      doi: '10.1234/did-review-2023'
    },
    {
      id: 3,
      title: 'Smart Contract Optimization Techniques',
      type: 'Technical Report',
      date: '2023-10-01',
      originalityScore: 92,
      citations: 0,
      status: 'under-review',
      doi: null
    }
  ]

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusBadge = (status) => {
    const styles = {
      'published': 'bg-green-100 text-green-700',
      'under-review': 'bg-yellow-100 text-yellow-700',
      'draft': 'bg-gray-100 text-gray-700'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {status.replace('-', ' ').charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Academic Publishing</h2>
          <p className="text-gray-600 mt-1">Publish and track your academic work</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Work</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Publications</span>
            <BookOpen className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">3</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Citations</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">20</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Avg. Originality</span>
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">91.7%</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Impact Score</span>
            <Award className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">8.5</p>
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-4">
        {publications.map((pub) => (
          <div key={pub.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{pub.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{pub.type}</span>
                  <span>•</span>
                  <span>{pub.date}</span>
                  {pub.doi && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-xs">DOI: {pub.doi}</span>
                    </>
                  )}
                </div>
              </div>
              {getStatusBadge(pub.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">Originality Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(pub.originalityScore)}`}>
                  {pub.originalityScore}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">Citations</p>
                <p className="text-2xl font-bold text-gray-900">{pub.citations}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">Views</p>
                <p className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 500) + 100}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button onClick={() => openPaper(pub)} className="flex-1 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>View Paper</span>
              </button>
              <button onClick={() => sharePublication(pub)} className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Academic Work</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input 
                  type="text" 
                  placeholder="Enter the title of your work"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>Research Paper</option>
                  <option>Literature Review</option>
                  <option>Technical Report</option>
                  <option>Thesis</option>
                  <option>Case Study</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop your document here</p>
                  <p className="text-sm text-gray-500 mb-4">PDF, DOC, or DOCX (max 10MB)</p>
                  <button onClick={() => fileInputRef.current?.click()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    {uploadFileName ? uploadFileName : 'Browse Files'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setUploadFileName(e.target.files[0].name)
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Originality Check</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Your document will be automatically checked for originality using our AI-powered plagiarism detection system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Upload & Check Originality
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AcademicPublishing
