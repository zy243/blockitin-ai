import React, { useState } from 'react'
import { Map, MapPin, Navigation, Clock, Users, Heart, BookOpen, Coffee, AlertCircle } from 'lucide-react'

const CampusMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  const locations = [
    {
      id: 1,
      name: 'Health Center',
      type: 'clinic',
      description: 'Campus medical services and emergency care',
      hours: '8:00 AM - 6:00 PM',
      status: 'open',
      coordinates: { x: 25, y: 30 },
      services: ['General Medicine', 'Mental Health', 'Emergency Care']
    },
    {
      id: 2,
      name: 'Engineering Building',
      type: 'academic',
      description: 'Computer Science and Engineering classes',
      hours: '7:00 AM - 10:00 PM',
      status: 'open',
      coordinates: { x: 50, y: 40 },
      rooms: ['Room 301 - AI Lab', 'Room 205 - Blockchain Lab']
    },
    {
      id: 3,
      name: 'Student Wellness Center',
      type: 'clinic',
      description: 'Mental health counseling and wellness programs',
      hours: '9:00 AM - 5:00 PM',
      status: 'open',
      coordinates: { x: 70, y: 25 },
      services: ['Counseling', 'Stress Management', 'Peer Support']
    },
    {
      id: 4,
      name: 'Library',
      type: 'academic',
      description: 'Main campus library and study spaces',
      hours: '24/7',
      status: 'open',
      coordinates: { x: 40, y: 60 },
      facilities: ['Study Rooms', 'Computer Lab', 'Research Center']
    },
    {
      id: 5,
      name: 'Student Union',
      type: 'social',
      description: 'Food court, meeting rooms, and social spaces',
      hours: '7:00 AM - 11:00 PM',
      status: 'open',
      coordinates: { x: 60, y: 50 },
      amenities: ['Food Court', 'Meeting Rooms', 'Event Space']
    },
    {
      id: 6,
      name: 'Sports Medicine Clinic',
      type: 'clinic',
      description: 'Athletic injuries and sports therapy',
      hours: '10:00 AM - 7:00 PM',
      status: 'closed',
      coordinates: { x: 80, y: 70 },
      services: ['Physical Therapy', 'Injury Assessment', 'Rehabilitation']
    }
  ]

  const getLocationIcon = (type) => {
    switch(type) {
      case 'clinic':
        return <Heart className="w-4 h-4" />
      case 'academic':
        return <BookOpen className="w-4 h-4" />
      case 'social':
        return <Coffee className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const getLocationColor = (type) => {
    switch(type) {
      case 'clinic':
        return 'bg-red-500 hover:bg-red-600'
      case 'academic':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'social':
        return 'bg-green-500 hover:bg-green-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const filteredLocations = locations.filter(location => {
    if (activeFilter === 'all') return true
    return location.type === activeFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Interactive Campus Map</h2>
          <p className="text-gray-600 mt-1">Navigate campus and check in to locations</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
          <Navigation className="w-5 h-5" />
          <span>Get Directions</span>
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Locations
        </button>
        <button
          onClick={() => setActiveFilter('clinic')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
            activeFilter === 'clinic'
              ? 'bg-red-100 text-red-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Health & Clinics</span>
        </button>
        <button
          onClick={() => setActiveFilter('academic')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
            activeFilter === 'academic'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Academic Buildings</span>
        </button>
        <button
          onClick={() => setActiveFilter('social')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
            activeFilter === 'social'
              ? 'bg-green-100 text-green-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Social Spaces</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ paddingBottom: '60%' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
              {/* Campus Background */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {/* Roads */}
                <path d="M 20 50 L 80 50" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                <path d="M 50 20 L 50 80" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                
                {/* Buildings Background */}
                <rect x="15" y="15" width="20" height="20" fill="#f3f4f6" rx="2" />
                <rect x="65" y="15" width="20" height="15" fill="#f3f4f6" rx="2" />
                <rect x="35" y="55" width="15" height="20" fill="#f3f4f6" rx="2" />
                <rect x="70" y="65" width="20" height="15" fill="#f3f4f6" rx="2" />
              </svg>

              {/* Location Markers */}
              {filteredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-white transition-all ${
                    getLocationColor(location.type)
                  } ${selectedLocation?.id === location.id ? 'ring-4 ring-white scale-110' : ''}`}
                  style={{ left: `${location.coordinates.x}%`, top: `${location.coordinates.y}%` }}
                >
                  {getLocationIcon(location.type)}
                </button>
              ))}

              {/* Current Location Indicator */}
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full animate-pulse"
                style={{ left: '55%', top: '45%' }}
              >
                <div className="absolute inset-0 bg-indigo-600 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Health Services</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Academic</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Social</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Your Location</span>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
          {selectedLocation ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedLocation.name}</h3>
                  <p className="text-gray-600 mt-1">{selectedLocation.description}</p>
                </div>
                <div className={`p-2 rounded-lg ${
                  selectedLocation.type === 'clinic' ? 'bg-red-100' :
                  selectedLocation.type === 'academic' ? 'bg-blue-100' :
                  'bg-green-100'
                }`}>
                  {getLocationIcon(selectedLocation.type)}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Hours: {selectedLocation.hours}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    selectedLocation.status === 'open' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {selectedLocation.status === 'open' ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>

              {selectedLocation.services && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Services:</p>
                  <div className="space-y-1">
                    {selectedLocation.services.map((service, index) => (
                      <div key={index} className="text-sm text-gray-600">• {service}</div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLocation.rooms && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Rooms:</p>
                  <div className="space-y-1">
                    {selectedLocation.rooms.map((room, index) => (
                      <div key={index} className="text-sm text-gray-600">• {room}</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowCheckInModal(true)}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Check In
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Get Directions
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <Map className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Select a location on the map to view details</p>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Today's Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Check-ins</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Classes Attended</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Health Services</span>
                <span className="font-semibold">1</span>
              </div>
            </div>
          </div>

          {/* Emergency Info */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Emergency Contacts</p>
                <p className="text-sm text-red-700 mt-1">Campus Security: 555-0911</p>
                <p className="text-sm text-red-700">Health Emergency: 555-0112</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in Modal */}
      {showCheckInModal && selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Check In to {selectedLocation.name}</h3>
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-indigo-900">Location Verified</p>
                  <p className="text-sm text-indigo-700">You are within check-in range</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Visit</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>Class Attendance</option>
                  <option>Health Appointment</option>
                  <option>Study Session</option>
                  <option>Meeting</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>Less than 30 minutes</option>
                  <option>30 minutes - 1 hour</option>
                  <option>1-2 hours</option>
                  <option>More than 2 hours</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Your check-in will be recorded on the blockchain for attendance verification.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowCheckInModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Confirm Check-in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CampusMap
