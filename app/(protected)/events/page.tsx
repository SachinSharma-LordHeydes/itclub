"use client"

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Filter,
  Search,
  Plus,
  Edit
} from 'lucide-react';
import { UserRole } from '@/types';

interface EventsProps {
  userRole: UserRole;
}

const EventsPage: React.FC<EventsProps> = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const events = [
    {
      id: '1',
      title: 'React Fundamentals Workshop',
      description: 'Learn the basics of React including components, props, and state management. Perfect for beginners.',
      date: new Date('2024-12-15'),
      time: '2:00 PM - 5:00 PM',
      location: 'Computer Lab A',
      type: 'workshop',
      capacity: 30,
      registered: 22,
      tags: ['React', 'JavaScript', 'Frontend']
    },
    {
      id: '2',
      title: 'AI Ethics Tech Talk',
      description: 'Discussion on ethical implications of artificial intelligence in modern society.',
      date: new Date('2024-12-18'),
      time: '4:00 PM - 6:00 PM',
      location: 'Auditorium B',
      type: 'webinar',
      capacity: 100,
      registered: 67,
      tags: ['AI', 'Ethics', 'Discussion']
    },
    {
      id: '3',
      title: 'Winter Hackathon 2024',
      description: '48-hour coding marathon with amazing prizes. Build innovative solutions to real-world problems.',
      date: new Date('2024-12-22'),
      time: '9:00 AM - 9:00 AM (+2 days)',
      location: 'Innovation Hub',
      type: 'hackathon',
      capacity: 80,
      registered: 45,
      tags: ['Hackathon', 'Competition', 'Innovation']
    },
    {
      id: '4',
      title: 'Python Data Science Bootcamp',
      description: 'Intensive bootcamp covering pandas, numpy, and matplotlib for data analysis.',
      date: new Date('2024-12-20'),
      time: '10:00 AM - 4:00 PM',
      location: 'Data Lab',
      type: 'workshop',
      capacity: 25,
      registered: 18,
      tags: ['Python', 'Data Science', 'Analytics']
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'webinar': return 'bg-green-100 text-green-800';
      case 'hackathon': return 'bg-purple-100 text-purple-800';
      case 'meeting': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || event.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-gray-600">Discover workshops, hackathons, and tech talks</p>
        </div>
        {userRole === 'admin' && (
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, topics, or tags..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="workshop">Workshops</option>
              <option value="webinar">Webinars</option>
              <option value="hackathon">Hackathons</option>
              <option value="meeting">Meetings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                {userRole === 'admin' && (
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit className="h-5 w-5" />
                  </button>
                )}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.registered}/{event.capacity} registered</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-4 text-sm text-gray-600 whitespace-nowrap">
                  {Math.round((event.registered / event.capacity) * 100)}% full
                </span>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Register for Event
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;