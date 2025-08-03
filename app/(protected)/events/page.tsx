"use client";

import {
  Calendar,
  Clock,
  Edit,
  Filter,
  MapPin,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: string;
  capacity: number;
  registered: number;
  tags: string[];
  organizerId?: string;
}

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showHostModal, setShowHostModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "workshop",
    capacity: "",
    tags: [] as string[],
  });
  const [currentTag, setCurrentTag] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const userId = "user123"; // Replace with useAuth().userId if using Clerk

  const popularTags = [
    "React",
    "JavaScript",
    "Python",
    "AI",
    "Data Science",
    "Hackathon",
    "Webinar",
    "Workshop",
    "Ethics",
    "Innovation",
  ];

  const events: Event[] = [
    {
      id: "1",
      title: "React Fundamentals Workshop",
      description:
        "Learn the basics of React including components, props, and state management. Perfect for beginners.",
      date: new Date("2025-12-15"),
      time: "2:00 PM - 5:00 PM",
      location: "Computer Lab A",
      type: "workshop",
      capacity: 30,
      registered: 22,
      tags: ["React", "JavaScript", "Frontend"],
      organizerId: "user123",
    },
    {
      id: "2",
      title: "AI Ethics Tech Talk",
      description:
        "Discussion on ethical implications of artificial intelligence in modern society.",
      date: new Date("2024-12-18"),
      time: "4:00 PM - 6:00 PM",
      location: "Auditorium B",
      type: "webinar",
      capacity: 100,
      registered: 67,
      tags: ["AI", "Ethics", "Discussion"],
      organizerId: "user456",
    },
    {
      id: "3",
      title: "Winter Hackathon 2024",
      description:
        "48-hour coding marathon with amazing prizes. Build innovative solutions to real-world problems.",
      date: new Date("2025-12-22"),
      time: "9:00 AM - 9:00 AM (+2 days)",
      location: "Innovation Hub",
      type: "hackathon",
      capacity: 80,
      registered: 45,
      tags: ["Hackathon", "Competition", "Innovation"],
      organizerId: "user123",
    },
    {
      id: "4",
      title: "Python Data Science Bootcamp",
      description:
        "Intensive bootcamp covering pandas, numpy, and matplotlib for data analysis.",
      date: new Date("2024-12-20"),
      time: "10:00 AM - 4:00 PM",
      location: "Data Lab",
      type: "workshop",
      capacity: 25,
      registered: 18,
      tags: ["Python", "Data Science", "Analytics"],
      organizerId: "user789",
    },
  ];

  const currentDate = new Date("2025-08-03");

  const tabs = [
    {
      id: "upcoming",
      label: "Upcoming Events",
      count: events.filter((event) => event.date >= currentDate).length,
    },
    {
      id: "hosted",
      label: "Hosted Events",
      count: events.filter((event) => event.organizerId === userId).length,
    },
    {
      id: "host",
      label: "Host an Event",
      icon: Plus,
      isAction: true,
    },
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "workshop":
        return "bg-blue-100 text-blue-800";
      case "webinar":
        return "bg-green-100 text-green-800";
      case "hackathon":
        return "bg-purple-100 text-purple-800";
      case "meeting":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFilteredEventsByTab = () => {
    switch (activeTab) {
      case "hosted":
        return events.filter((event) => event.organizerId === userId);
      case "upcoming":
        return events.filter((event) => event.date >= currentDate);
      default:
        return events;
    }
  };

  const filteredEvents = getFilteredEventsByTab().filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType = filterType === "all" || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = (tagToAdd?: string) => {
    const tag = (tagToAdd || currentTag).trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setCurrentTag("");
      setShowTagSuggestions(false);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Escape") {
      setShowTagSuggestions(false);
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentTag(value);
    setShowTagSuggestions(value.length > 0);
  };

  const getFilteredSuggestions = () => {
    if (!currentTag) return [];
    return popularTags
      .filter(
        (tag) =>
          tag.toLowerCase().includes(currentTag.toLowerCase()) &&
          !formData.tags.includes(tag)
      )
      .slice(0, 8);
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      type: "workshop",
      capacity: "",
      tags: [],
    });
    setCurrentTag("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.date.trim() ||
      !formData.time.trim() ||
      !formData.location.trim() ||
      !formData.capacity.trim()
    ) {
      console.log("Please fill in all required fields");
      return;
    }
    console.log("New event:", formData);
    setShowHostModal(false);
    resetForm();
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === "host") {
      setShowHostModal(true);
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-gray-600">
            Discover workshops, hackathons, and tech talks
          </p>
        </div>
        {
          <button
            onClick={() => setShowHostModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </button>
        }
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

      {/* Filter Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 mb-8 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav
            className="flex space-x-0 px-2 overflow-x-auto"
            aria-label="Tabs"
          >
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id && !tab.isAction
                      ? "border-blue-500 text-blue-600 bg-blue-50/50"
                      : tab.isAction
                      ? "border-transparent text-green-600 hover:text-green-700 hover:bg-green-50/50 hover:border-green-300"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 hover:border-gray-300"
                  } ${tab.id === "host"}`}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span>{tab.label}</span>
                  {!tab.isAction && (
                    <span
                      className={`py-0.5 px-2 rounded-full text-xs transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(
                    event.type
                  )}`}
                >
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                {
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit className="h-5 w-5" />
                  </button>
                }
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {event.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {event.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {event.date.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
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
                  <span className="text-sm">
                    {event.registered}/{event.capacity} registered
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(event.registered / event.capacity) * 100}%`,
                    }}
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

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
              setActiveTab("upcoming");
            }}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Host Event Modal */}
      {showHostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Host New Event
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Create a new event for the community
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowHostModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Time *
                  </label>
                  <input
                    type="text"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="e.g., 2:00 PM - 5:00 PM"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter event location"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Event Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="workshop">Workshop</option>
                  <option value="webinar">Webinar</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="capacity"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Capacity *
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="Enter maximum attendees"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1"
                />
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Tags
                  <span className="text-gray-400 font-normal ml-1">
                    ({formData.tags.length} selected)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="tags"
                    value={currentTag}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    onFocus={() => setShowTagSuggestions(currentTag.length > 0)}
                    onBlur={() =>
                      setTimeout(() => setShowTagSuggestions(false), 200)
                    }
                    placeholder="Type tags and press Enter (e.g., React, AI)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {showTagSuggestions &&
                    getFilteredSuggestions().length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {getFilteredSuggestions().map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAddTag(suggestion)}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Press Enter or click suggestions to add tags
                </p>
                {formData.tags.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Selected Tags:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200 hover:bg-blue-200 transition-colors"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {formData.tags.length < 8 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Popular Tags:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popularTags
                        .filter((tag) => !formData.tags.includes(tag))
                        .slice(0, 8)
                        .map((tag, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAddTag(tag)}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                          >
                            {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowHostModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  disabled={
                    !formData.title.trim() ||
                    !formData.description.trim() ||
                    !formData.date.trim() ||
                    !formData.time.trim() ||
                    !formData.location.trim() ||
                    !formData.capacity.trim()
                  }
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
