import React, { useState } from 'react'
import { FileText, Sparkles, Download, Eye, Edit3, Save } from 'lucide-react'

const ResumeBuilder: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [resumeData, setResumeData] = useState({
    objective: 'Passionate computer science graduate seeking to leverage AI and blockchain expertise in innovative tech solutions.',
    skills: ['Python', 'JavaScript', 'Solidity', 'Machine Learning', 'React', 'Node.js'],
    experience: [
      {
        title: 'Blockchain Developer Intern',
        company: 'Tech Innovations Inc.',
        period: 'Jun 2023 - Aug 2023',
        description: 'Developed smart contracts for NFT marketplace'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Computer Science',
        institution: 'Stanford University',
        year: '2023',
        gpa: '3.8/4.0'
      }
    ]
  })

  const handleAIGenerate = () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">AI Resume Builder</h2>
          <p className="text-gray-600 mt-1">Create professional resumes powered by AI</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Preview</span>
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resume Content</h3>
              <button 
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                <span>{isGenerating ? 'Generating...' : 'AI Generate'}</span>
              </button>
            </div>

            {/* Objective Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Objective</label>
              <textarea 
                value={resumeData.objective}
                onChange={(e) => setResumeData({...resumeData, objective: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Skills Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                placeholder="Add a skill and press Enter"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    setResumeData({
                      ...resumeData, 
                      skills: [...resumeData.skills, e.currentTarget.value]
                    })
                    e.currentTarget.value = ''
                  }
                }}
              />
            </div>

            {/* Experience Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Experience</label>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center space-x-1">
                  <Edit3 className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                  <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                  <p className="text-gray-600 text-sm">{exp.company} • {exp.period}</p>
                  <p className="text-gray-700 text-sm mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="border-2 border-gray-200 rounded-lg p-8 min-h-[600px]">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Sarah Johnson</h3>
            <p className="text-gray-600 mb-6">sarah.johnson@email.com • (555) 123-4567</p>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">Objective</h4>
              <p className="text-gray-700">{resumeData.objective}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="text-gray-700">
                    {skill}{index < resumeData.skills.length - 1 ? ' •' : ''}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">Experience</h4>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <h5 className="font-semibold text-gray-900">{exp.title}</h5>
                  <p className="text-gray-600 text-sm">{exp.company} | {exp.period}</p>
                  <p className="text-gray-700 text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">Education</h4>
              {resumeData.education.map((edu, index) => (
                <div key={index}>
                  <h5 className="font-semibold text-gray-900">{edu.degree}</h5>
                  <p className="text-gray-600 text-sm">{edu.institution} • {edu.year}</p>
                  <p className="text-gray-700 text-sm">GPA: {edu.gpa}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
