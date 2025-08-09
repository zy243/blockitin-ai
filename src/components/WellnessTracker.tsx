import React, { useState } from 'react'
import { Smile, Frown, Meh, Moon, Activity, Brain, Calendar } from 'lucide-react'

const WellnessTracker: React.FC = () => {
  const [sleepHours, setSleepHours] = useState<number | ''>('')
  const [stressLevel, setStressLevel] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  const [entries, setEntries] = useState<typeof weeklyData>(weeklyData)
  const [selectedMood, setSelectedMood] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  const moods = [
    { id: 'great', icon: Smile, label: 'Great', color: 'text-green-500' },
    { id: 'good', icon: Smile, label: 'Good', color: 'text-blue-500' },
    { id: 'okay', icon: Meh, label: 'Okay', color: 'text-yellow-500' },
    { id: 'bad', icon: Frown, label: 'Bad', color: 'text-red-500' },
  ]

  const weeklyData = [
    { day: 'Mon', mood: 'great', sleep: 8, stress: 2 },
    { day: 'Tue', mood: 'good', sleep: 7, stress: 3 },
    { day: 'Wed', mood: 'okay', sleep: 6, stress: 5 },
    { day: 'Thu', mood: 'good', sleep: 7.5, stress: 3 },
    { day: 'Fri', mood: 'great', sleep: 8, stress: 2 },
    { day: 'Sat', mood: 'great', sleep: 9, stress: 1 },
    { day: 'Sun', mood: 'good', sleep: 8, stress: 2 },
  ]

  const getMoodColor = (mood) => {
    switch(mood) {
      case 'great': return 'bg-green-500'
      case 'good': return 'bg-blue-500'
      case 'okay': return 'bg-yellow-500'
      case 'bad': return 'bg-red-500'
      default: return 'bg-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Wellness Tracker</h2>
        <p className="text-gray-600 mt-1">Monitor your mental health and well-being</p>
      </div>

      {/* Today's Check-in */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling today?</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {moods.map((mood) => {
            const Icon = mood.icon
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMood === mood.id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-12 h-12 mx-auto mb-2 ${mood.color}`} />
                <p className="text-sm font-medium text-gray-700">{mood.label}</p>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Moon className="w-4 h-4 inline mr-1" />
              Sleep Hours
            </label>
            <input 
              type="number" 
              min="0" 
              max="24" 
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Brain className="w-4 h-4 inline mr-1" />
              Stress Level (1-10)
            </label>
            <input 
              type="number" 
              min="1" 
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was your day? Any specific events affecting your mood?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <button
          onClick={() => {
            if (!selectedMood) {
              alert('Please select your mood for today.')
              return
            }
            const newEntry = {
              day: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
              mood: selectedMood,
              sleep: sleepHours || 0,
              stress: stressLevel || 0,
            }
            setEntries(prev => {
              const updated = [...prev.slice(1), newEntry] // simple rolling update
              return updated
            })
            setSleepHours('')
            setStressLevel('')
            setNotes('')
            alert('Entry saved!')
          }}
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Save Today's Entry
        </button>
      </div>

      {/* Weekly Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Overview</h3>
        
        <div className="grid grid-cols-7 gap-2 mb-6">
          {entries.map((day) => (
            <div key={day.day} className="text-center">
              <p className="text-sm text-gray-600 mb-2">{day.day}</p>
              <div className={`w-12 h-12 rounded-full ${getMoodColor(day.mood)} mx-auto mb-2`}></div>
              <p className="text-xs text-gray-500">{day.sleep}h sleep</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-700 font-medium">Average Mood</span>
              <Smile className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-900">Good</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-700 font-medium">Avg Sleep</span>
              <Moon className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900">7.5 hrs</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-700 font-medium">Stress Level</span>
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-900">Low</p>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Mood Calendar</h3>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input 
              type="month" 
              value={selectedDate.substring(0, 7)}
              onChange={(e) => setSelectedDate(e.target.value + '-01')}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
          {/* Calendar days would be dynamically generated here */}
          {Array.from({ length: 35 }, (_, i) => (
            <div 
              key={i} 
              className={`aspect-square rounded-lg border border-gray-200 flex items-center justify-center text-sm ${
                i % 7 === 0 || i % 7 === 6 ? 'bg-gray-50' : ''
              }`}
            >
              {i < 31 && (
                <div className={`w-8 h-8 rounded-full ${
                  i % 4 === 0 ? 'bg-green-500' : 
                  i % 4 === 1 ? 'bg-blue-500' : 
                  i % 4 === 2 ? 'bg-yellow-500' : 
                  'bg-gray-300'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WellnessTracker
