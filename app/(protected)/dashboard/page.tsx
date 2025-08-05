"use client";

import { GET_RESOURCES } from "@/client/resource/resourceQueries";
import { GET_USER } from "@/client/user/userQueries";
import { useQuery } from "@apollo/client";
import { Award, BookOpen, Calendar, Code, Upload } from "lucide-react";

const UserDashboard = () => {
  const upcomingEvents = [
    {
      title: "React Workshop",
      date: "Dec 15",
      time: "2:00 PM",
      type: "workshop",
    },
    {
      title: "Tech Talk: AI Ethics",
      date: "Dec 18",
      time: "4:00 PM",
      type: "webinar",
    },
    {
      title: "Winter Hackathon",
      date: "Dec 22",
      time: "9:00 AM",
      type: "hackathon",
    },
  ];

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER);

  const {
    data: resourcesData,
    loading: resourcesLoading,
  } = useQuery(GET_RESOURCES, {
    variables: { limit: 3, offset: 0 },
  });
  // const {data,loading,error}=useQuery(GET_EVENTS)

  if (userError)
    return <div className="p-4">userError: {userError.message}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 ">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {`Welcome back, ${
            userLoading ? "" : `${userData.getUser.first_name}! 👋`
          }`}
        </h1>
        <p className="text-gray-600">
          Here&apos;s what&apos;s happening in your tech journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 text-center">
          <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          {userLoading ? (
            <div className="h-6 w-10 bg-gray-200 animate-pulse rounded mx-auto mb-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">12</p>
          )}
          <p className="text-sm text-gray-600">Events Attended</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 text-center">
          <Code className="h-8 w-8 text-green-600 mx-auto mb-2" />
          {userLoading ? (
            <div className="h-6 w-10 bg-gray-200 animate-pulse rounded mx-auto mb-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {userData.getUser.projects.length}
            </p>
          )}
          <p className="text-sm text-gray-600">Projects Shared</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 text-center">
          <Upload className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          {userLoading ? (
            <div className="h-6 w-10 bg-gray-200 animate-pulse rounded mx-auto mb-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {userData.getUser.resources.length}
            </p>
          )}
          <p className="text-sm text-gray-600">Resource Uploaded</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 text-center">
          <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          {userLoading ? (
            <div className="h-6 w-10 bg-gray-200 animate-pulse rounded mx-auto mb-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {userData.getUser.events.length}
            </p>
          )}
          <p className="text-sm text-gray-600">Event Organized</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {event.date} at {event.time}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.type === "workshop"
                        ? "bg-blue-100 text-blue-800"
                        : event.type === "webinar"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Resources */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Recent Resources
            </h2>
            {resourcesLoading ? (
              <div className="rounded-lg shadow-lg p-6 border border-gray-100 bg-gray-200 animate-pulse"></div>
            ) : (
              <div className="space-y-4">
                {resourcesData?.getResources.map(
                  (
                    resource: {
                      title: string;
                      document_type: string;
                      user: { first_name: string };
                    },
                    index: string
                  ) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <h3 className="font-medium text-gray-900 text-sm">
                        {resource.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {resource.document_type} • {resource.user.first_name}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Ready for more?</h2>
            <div className="space-y-3">
              <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Join Next Event
              </button>
              <button className="w-full border border-white text-white py-2 px-4 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                Share a Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
