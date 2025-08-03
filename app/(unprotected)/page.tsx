import React from 'react';
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Code, 
  Briefcase, 
  Award,
  ArrowRight,
  Monitor,
  Cpu,
  Network
} from 'lucide-react';
import Link from 'next/link';

const Page = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Join workshops, hackathons, and tech talks with seamless RSVP system'
    },
    {
      icon: BookOpen,
      title: 'Resource Library',
      description: 'Access curated tutorials, documentation, and learning materials'
    },
    {
      icon: Code,
      title: 'Project Showcase',
      description: 'Share your projects and collaborate with fellow developers'
    },
    {
      icon: Briefcase,
      title: 'Job Board',
      description: 'Discover internships and career opportunities in tech'
    },
    {
      icon: Users,
      title: 'Alumni Network',
      description: 'Connect with graduates for mentorship and career guidance'
    },
    {
      icon: Award,
      title: 'Skill Certification',
      description: 'Track your learning progress and earn industry certifications'
    }
  ];

  const stats = [
    { number: '500+', label: 'Active Members' },
    { number: '50+', label: 'Events This Year' },
    { number: '200+', label: 'Projects Shared' },
    { number: '85%', label: 'Job Placement Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <Monitor className="h-16 w-16" />
              <Cpu className="h-12 w-12" />
              <Network className="h-14 w-14" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-blue-200">TechClub</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-blue-100">
              Your gateway to the future of technology. Learn, build, connect, and grow with the most innovative IT community on campus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg flex items-center space-x-2"
              >
                <span>Join Community</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/events"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From learning resources to career opportunities, our platform provides comprehensive support for your tech journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Tech Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join hundreds of students who are already building the future. Connect, learn, and grow with us.
          </p>
          <Link
            href="/dashboard"
            className="bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg inline-flex items-center space-x-2"
          >
            <span>Get Started Today</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
      
    </div>
  );
};

export default Page;