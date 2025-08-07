import React, { useState, useRef } from 'react'
import { Award, Shield, Eye, Share2, Download, Plus, Filter, Search } from 'lucide-react'

const Credentials: React.FC = () => {
  const [detailCredential, setDetailCredential] = useState<typeof credentials[0] | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [showMintModal, setShowMintModal] = useState(false)
  const [filter, setFilter] = useState('all')

  const credentials = [
    {
      id: 'cs-degree',
      title: 'Computer Science Degree NFT',
      issuer: 'Stanford University',
      date: '2023-06-15',
      type: 'degree',
      verified: true,
      views: 1247,
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
      description: 'Bachelor of Science in Computer Science with specialization in Artificial Intelligence'
    },
    {
      id: 'ai-certification',
      title: 'AI Certification',
      issuer: 'MIT OpenCourseWare',
      date: '2023-08-20',
      type: 'certification',
      verified: true,
      views: 892,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
      description: 'Advanced certification in Machine Learning and Neural Networks'
    },
    {
      id: 'blockchain-cert',
      title: 'Blockchain Developer Certificate',
      issuer: 'Ethereum Foundation',
      date: '2023-09-10',
      type: 'certification',
      verified: true,
      views: 634,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
      description: 'Professional certification in Smart Contract Development and DeFi protocols'
    },
    {
      id: 'research-award',
      title: 'Outstanding Research Award',
      issuer: 'IEEE Computer Society',
      date: '2023-07-05',
      type: 'award',
      verified: true,
      views: 445,
      image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=300&fit=crop',
      description: 'Recognition for groundbreaking research in quantum computing applications'
    },
    {
      id: 'course-completion',
      title: 'Advanced React Development',
      issuer: 'Meta',
      date: '2023-10-15',
      type: 'course-completion',
      verified: true,
      views: 567,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      description: 'Complete course on React 18, Hooks, and Advanced Patterns'
    }
  ]

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'degree': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'certification': return 'bg-green-100 text-green-700 border-green-200'
      case 'award': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'course-completion': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'degree': return '🎓'
      case 'certification': return '🏆'
      case 'award': return '🏅'
      case 'course-completion': return '📚'
      default: return '📄'
    }
  }

  const viewCredential = (cred: typeof credentials[0]) => {
    setDetailCredential(cred)
  }

  const shareCredential = (cred: typeof credentials[0]) => {
    if (navigator.share) {
      navigator.share({
        title: cred.title,
        text: `Check out my credential: ${cred.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Share link copied to clipboard')
    }
  }

  const downloadCredential = (cred: typeof credentials[0]) => {
    const link = document.createElement('a')
    link.href = cred.image
    link.download = cred.title.replace(/\s+/g, '-') + '.jpg'
    link.click()
  }

  const filteredCredentials = credentials.filter(cred => {
    if (filter === 'all') return true
    return cred.type === filter
  })

  const filterOptions = [
    { value: 'all', label: 'All Credentials', icon: '📋' },
    { value: 'degree', label: 'Degree', icon: '🎓' },
    { value: 'certification', label: 'Certification', icon: '🏆' },
    { value: 'award', label: 'Award', icon: '🏅' },
    { value: 'course-completion', label: 'Course Completion', icon: '📚' }
  ]

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            NFT Credentials
          </h2>
          <p className="text-gray-600 text-lg">Your verified academic achievements on the blockchain</p>
        </div>
        <button 
          onClick={() => setShowMintModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Mint New NFT</span>
        </button>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-700 font-medium">Total NFTs</span>
            <div className="bg-blue-500 p-2 rounded-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-900">{credentials.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-green-700 font-medium">Total Views</span>
            <div className="bg-green-500 p-2 rounded-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-900">
            {credentials.reduce((sum, cred) => sum + cred.views, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-purple-700 font-medium">Verified</span>
            <div className="bg-purple-500 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-900">
            {credentials.filter(cred => cred.verified).length}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-sm border border-orange-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-orange-700 font-medium">This Month</span>
            <div className="bg-orange-500 p-2 rounded-lg">
              <Plus className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-900">2</p>
        </div>
      </div>

      {/* Enhanced Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                filter === option.value
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCredentials.map((credential) => (
          <div key={credential.id} id={credential.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="relative">
              <img 
                src={credential.image} 
                alt={credential.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                {credential.verified && (
                  <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                    <Shield className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 left-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm bg-white/90 ${getTypeColor(credential.type)}`}>
                  <span className="mr-2">{getTypeIcon(credential.type)}</span>
                  {credential.type.charAt(0).toUpperCase() + credential.type.slice(1).replace('-', ' ')}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{credential.title}</h3>
              <p className="text-gray-600 mb-2 font-medium">{credential.issuer}</p>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{credential.description}</p>
              
              <div className="text-sm text-gray-500 mb-4 flex items-center">
                <span className="mr-2">📅</span>
                Issued: {credential.date}
              </div>
              
              <div className="flex space-x-2">
                <button onClick={() => viewCredential(credential)} className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">View</span>
                </button>
                <button onClick={() => shareCredential(credential)} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                  <Share2 className="w-4 h-4" />
                  <span className="font-medium">Share</span>
                </button>
                <button onClick={() => downloadCredential(credential)} className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Details Modal */}
      {detailCredential && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{detailCredential.title}</h3>
              <button onClick={() => setDetailCredential(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <img src={detailCredential.image} alt={detailCredential.title} className="w-full h-48 object-cover rounded-xl mb-4" />
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium">Issuer:</span>
                <span className="text-gray-900">{detailCredential.issuer}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium">Type:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(detailCredential.type)}`}>
                  {getTypeIcon(detailCredential.type)} {detailCredential.type.charAt(0).toUpperCase() + detailCredential.type.slice(1).replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium">Issued:</span>
                <span className="text-gray-900">{detailCredential.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium">Views:</span>
                <span className="text-gray-900">{detailCredential.views.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-gray-700 mt-4 mb-6 leading-relaxed">{detailCredential.description}</p>
            <div className="flex justify-end">
              <button onClick={() => setDetailCredential(null)} className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mint Modal */}
      {showMintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Mint New NFT Credential</h3>
              <button onClick={() => setShowMintModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credential Type</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300">
                  <option>Degree</option>
                  <option>Certification</option>
                  <option>Award</option>
                  <option>Course Completion</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Master's in Data Science"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Institution</label>
                <input 
                  type="text" 
                  placeholder="e.g., Harvard University"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-all duration-300 hover:border-indigo-400"
                >
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-gray-600">{selectedFileName ? selectedFileName : 'Drag and drop or click to upload'}</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name || null)}
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💰</span>
                <p className="text-sm text-blue-800 font-medium">
                  Minting cost: 0.05 ETH (~$85) + gas fees
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowMintModal(false)}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium">
                Mint NFT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Credentials