import React from 'react'
import { Award, FileText, Heart, TrendingUp, Calendar, BookOpen } from 'lucide-react'

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'NFT Credentials', value: '12', icon: Award, color: 'bg-blue-500' },
    { label: 'Resume Views', value: '234', icon: FileText, color: 'bg-green-500' },
    { label: 'Health Records', value: '8', icon: Heart, color: 'bg-red-500' },
    { label: 'Wellness Score', value: '85%', icon: TrendingUp, color: 'bg-purple-500' },
  ]

  const recentActivity = [
    { type: 'credential', title: 'Computer Science Degree NFT Minted', time: '2 hours ago' },
    { type: 'health', title: 'COVID-19 Vaccination Record Uploaded', time: '1 day ago' },
    { type: 'attendance', title: 'Attended Advanced AI Lecture', time: '2 days ago' },
    { type: 'publish', title: 'Research Paper Published', time: '1 week ago' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Sarah!</h2>
        <p className="text-gray-600">Here's your academic identity overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{activity.title}</p>
                <p className="text-gray-500 text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-all transform hover:-translate-y-1">
          <Award className="w-8 h-8 mb-3" />
          <h4 className="font-semibold mb-1">Mint New Credential</h4>
          <p className="text-sm opacity-90">Convert your achievements to NFTs</p>
        </button>
        
        <button className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl p-6 hover:shadow-lg transition-all transform hover:-translate-y-1">
          <FileText className="w-8 h-8 mb-3" />
          <h4 className="font-semibold mb-1">Update Resume</h4>
          <p className="text-sm opacity-90">AI-powered resume builder</p>
        </button>
        
        <button className="bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-xl p-6 hover:shadow-lg transition-all transform hover:-translate-y-1">
          <Heart className="w-8 h-8 mb-3" />
          <h4 className="font-semibold mb-1">Health Check-in</h4>
          <p className="text-sm opacity-90">Update wellness status</p>
        </button>
      </div>
    </div>
  )
}

export default Dashboard
