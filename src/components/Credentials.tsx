import React, { useState } from 'react'
import { Award, ExternalLink, Shield, Download, Plus } from 'lucide-react'

const Credentials: React.FC = () => {
  const [credentials] = useState([
    {
      id: 1,
      title: 'Bachelor of Computer Science',
      issuer: 'Stanford University',
      date: '2023-05-15',
      tokenId: '#1234',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
      verified: true
    },
    {
      id: 2,
      title: 'Machine Learning Certificate',
      issuer: 'Coursera',
      date: '2023-08-20',
      tokenId: '#5678',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
      verified: true
    },
    {
      id: 3,
      title: 'Blockchain Developer',
      issuer: 'Ethereum Foundation',
      date: '2023-09-10',
      tokenId: '#9012',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
      verified: true
    }
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">NFT Credentials</h2>
          <p className="text-gray-600 mt-1">Your verified academic achievements on the blockchain</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Mint New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {credentials.map((credential) => (
          <div key={credential.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
            <div className="relative">
              <img 
                src={credential.image} 
                alt={credential.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                {credential.verified && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{credential.title}</h3>
              <p className="text-gray-600 mb-4">{credential.issuer}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Issue Date</span>
                  <span className="text-gray-900">{credential.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Token ID</span>
                  <span className="text-gray-900 font-mono">{credential.tokenId}</span>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Chain</span>
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Credentials
