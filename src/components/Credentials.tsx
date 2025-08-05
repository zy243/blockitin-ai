import React, { useState } from 'react'
import { Award, Shield, Eye, Share2, Download, Plus, Filter, Search } from 'lucide-react'

const Credentials: React.FC = () => {
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
    }
  ]

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'degree': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'certification': return 'bg-green-100 text-green-700 border-green-200'
      case 'award': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const filteredCredentials = credentials.filter(cred => {
    if (filter === 'all') return true
    return cred.type === filter
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">NFT Credentials</h2>
          <p className="text-gray-600 mt-1">Your verified academic achievements on the blockchain</p>
        </div>
        <button 
          onClick={() => setShowMintModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Mint New NFT</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total NFTs</span>
            <Award className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{credentials.length}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Views</span>
            <Eye className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {credentials.reduce((sum, cred) => sum + cred.views, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Verified</span>
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {credentials.filter(cred => cred.verified).length}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">This Month</span>
            <Plus className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">2</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <div className="flex space-x-2">
          {['all', 'degree', 'certification', 'award'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === type
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCredentials.map((credential) => (
          <div key={credential.id} id={credential.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src={credential.image} 
                alt={credential.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                {credential.verified && (
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <Shield className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(credential.type)}`}>
                  {credential.type.charAt(0).toUpperCase() + credential.type.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{credential.title}</h3>
              <p className="text-gray-600 mb-2">{credential.issuer}</p>
              <p className="text-sm text-gray-500 mb-4">{credential.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Issued: {credential.date}</span>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{credential.views.toLocaleString()} views</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mint Modal */}
      {showMintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Mint New NFT Credential</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credential Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Institution</label>
                <input 
                  type="text" 
                  placeholder="e.g., Harvard University"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <p className="text-gray-600">Drag and drop or click to upload</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Minting cost: 0.05 ETH (~$85) + gas fees
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowMintModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
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
