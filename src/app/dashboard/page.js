import React from "react";
import Link from "next/link";

const KUPalsDashboard = () => {
  const userName = "TchuTcu";
  const userId = "kupals-user-id-1234567890abcdef";

  const myGroups = [
    { id: "g1", name: "Hiking Enthusiasts", type: "Public" },
    { id: "g2", name: "COMP 206 Study Group", type: "Private" },
    { id: "g3", name: "Dhamakader project group", type: "Public" },
  ];

  const recentChats = [
    { senderId: "userA", message: "hi everyone" },
    { senderId: "userB", message: "blabla blala" },
    { senderId: "userC", message: "blah blah blah ablh" },
  ];

  const notifications = [
    {
      id: "n1",
      title: "New Event: Annual Tech Fest",
      message:
        "fafa afdafa adsfa sfd asf af asfa sfaf safaf dasfasfdasfasfasf das",
      timestamp: new Date(),
    },
    {
      id: "n2",
      title: "Group Update: Hiking Trip Confirmed",
      message: "dasfasfdasfasfasf ghfdafa adsfa sfd asf af rteger.",
      timestamp: new Date(),
    },
    {
      id: "n3",
      title: "New Message from Suman Shrestha",
      message: "fdafa adsfa sfd asf af ilsfdafa adsfa sfd asf af .",
      timestamp: new Date(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
      <nav className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <span className="text-xl font-bold text-[#158080]">KUPals</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome, {userName}!</span>
        </div>
      </nav>

      {/* Main Content Area place */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white shadow-md p-4 flex flex-col space-y-4 border-r border-gray-200">
          <nav className="space-y-2">
            <Link
              href="dashboard"
              className="block px-3 py-2 bg-gray-100 text-[#158080] font-semibold rounded-md transition duration-150 ease-in-out"
            >
              Dashboard
            </Link>
            <Link
              href="group"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
            >
              Groups
            </Link>
            <Link
              href="chat"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
            >
              Chat
            </Link>
            <Link
              href="profile"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
            >
              Profile
            </Link>
            <Link
              href="settings"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
            >
              Settings
            </Link>
          </nav>
          {userId && (
            <div className="mt-auto p-3 bg-gray-100 rounded-lg text-sm text-gray-600 break-words">
              User ID: <br />{" "}
              <span className="font-mono text-xs">{userId}</span>
            </div>
          )}
        </aside>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Your KUPals Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                My Groups
              </h2>
              <p className="text-gray-900 text-3xl font-bold">
                {myGroups.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Unread Chats
              </h2>
              <p className="text-gray-900 text-3xl font-bold">
                {recentChats.length}
              </p>
              <p className="text-gray-500">New messages in your chats</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Notifications
              </h2>
              <p className="text-gray-900 text-3xl font-bold">
                {notifications.length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                My Groups
              </h2>
              {myGroups.length > 0 ? (
                <ul className="space-y-3">
                  {myGroups.map((group) => (
                    <li
                      key={group.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-150"
                    >
                      <div className="w-8 h-8 bg-[#158080] text-white flex items-center justify-center rounded-full text-sm font-bold">
                        {group.name ? group.name.charAt(0).toUpperCase() : "G"}
                      </div>
                      <span className="text-gray-800 font-medium">
                        {group.name || `Group ${group.id.substring(0, 5)}`}
                      </span>
                      <span className="text-gray-500 text-sm ml-auto">
                        ({group.type || "Public"})
                      </span>
                    </li>
                  ))}
                  <li className="text-center pt-2">
                    <button className="text-[#158080] hover:underline">
                      View All Groups
                    </button>
                  </li>
                </ul>
              ) : (
                <p className="text-gray-500">
                  No groups found. Start by creating or joining one!
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Recent Chats
              </h2>
              {recentChats.length > 0 ? (
                <ul className="space-y-3">
                  {recentChats.map((chat, index) => (
                    <li
                      key={index}
                      className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-150"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm font-bold">
                          {chat.senderId
                            ? chat.senderId.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <span className="font-medium text-gray-800">
                          {chat.senderId
                            ? `User ${chat.senderId.substring(0, 8)}`
                            : "Unknown User"}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1 truncate">
                        {chat.message}
                      </p>
                      <button className="text-xs text-[#158080] hover:underline mt-1">
                        Reply
                      </button>
                    </li>
                  ))}
                  <li className="text-center pt-2">
                    <button className="text-[#158080] hover:underline">
                      View All Chats
                    </button>
                  </li>
                </ul>
              ) : (
                <p className="text-gray-500">
                  No recent chats. Start a conversation!
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 lg:col-span-2">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Notifications
              </h2>
              {notifications.length > 0 ? (
                <ul className="space-y-3">
                  {notifications.map((notification, index) => (
                    <li
                      key={index}
                      className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-150"
                    >
                      <p className="font-medium text-gray-800">
                        {notification.title || "New Notification"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {notification.message || "You have a new update."}
                      </p>
                      {notification.timestamp && (
                        <span className="text-xs text-gray-400">
                          {notification.timestamp.toLocaleString()}
                        </span>
                      )}
                    </li>
                  ))}
                  <li className="text-center pt-2">
                    <button className="text-[#158080] hover:underline">
                      View All Notifications
                    </button>
                  </li>
                </ul>
              ) : (
                <p className="text-gray-500">No new notifications.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KUPalsDashboard;
