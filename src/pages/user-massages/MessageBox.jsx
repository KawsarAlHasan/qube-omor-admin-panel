import React from "react";
import { Avatar, Typography } from "antd";
import {
  MoreOutlined,
  PaperClipOutlined,
  SmileOutlined,
  SendOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

function MessageBox() {
  //   if (!user) return null;

  const user = {
    id: 1,
    full_name: "Shahrukh Khan",
    profile:
      "https://in.bmscdn.com/iedb/artist/images/website/poster/large/shah-rukh-khan-2092-12-09-2017-02-10-43.jpg",
    last_message: "Are we meeting tomorrow?",
    un_read_message: 2,
    last_message_time: "2025-07-20T14:30:00Z",
    is_active: true,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <div className="flex items-center">
          <div className="relative">
            <Avatar
              size={48}
              src={
                <img
                  src={user.profile}
                  alt={user.full_name}
                  className="object-cover"
                />
              }
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                user.is_active ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
          </div>
          <div className="ml-3">
            <Text strong className="text-lg block">
              {user.full_name}
            </Text>
            <Text type="secondary" className="text-xs flex items-center">
              {user.is_active
                ? "Online"
                : `Last seen ${formatLastSeen(user.last_message_time)}`}
            </Text>
          </div>
        </div>
        <div className="bg-gray-100 rounded-full p-2 cursor-pointer">
          <MoreOutlined className="text-lg" />
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {user.last_message ? (
          <div className="flex flex-col space-y-4">
            <div className="text-center">17 May 2025</div>

            {/* Sample message history */}
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white rounded-xl rounded-tr-none px-4 py-2 max-w-xs">
                <p>Hello! Are we meeting tomorrow?</p>
                <Text className="text-gray-200 text-xs block mt-1 text-right">
                  10:30 AM
                </Text>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-xl rounded-tl-none px-4 py-2 max-w-xs shadow-sm">
                <p>Yes, at 2 PM. Does that work for you?</p>
                <Text className="text-gray-500 text-xs block mt-1 text-right">
                  10:32 AM
                </Text>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-blue-500 text-white rounded-xl rounded-tr-none px-4 py-2 max-w-xs">
                <p>Perfect! See you then.</p>
                <Text className="text-gray-200 text-xs block mt-1 text-right">
                  10:33 AM
                </Text>
              </div>
            </div>

            <div className="text-center">Today</div>

            {/* Sample message history */}
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-xl rounded-tl-none px-4 py-2 max-w-xs shadow-sm">
                <p>Yes, at 2 PM. Does that work for you?</p>
                <Text className="text-gray-500 text-xs block mt-1 text-right">
                  10:32 AM
                </Text>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-blue-500 text-white rounded-xl rounded-tr-none px-4 py-2 max-w-xs">
                <p>Hello! Are we meeting tomorrow?</p>
                <Text className="text-gray-200 text-xs block mt-1 text-right">
                  10:30 AM
                </Text>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-xl rounded-tl-none px-4 py-2 max-w-xs shadow-sm">
                <p>Yes, at 2 PM. Does that work for you?</p>
                <Text className="text-gray-500 text-xs block mt-1 text-right">
                  10:32 AM
                </Text>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <Text strong className="text-lg block mb-2">
                Start a conversation
              </Text>
              <Text type="secondary">
                Send your first message to {user.full_name.split(" ")[0]}
              </Text>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="flex space-x-2 mr-3">
            <button className="text-gray-500 hover:text-gray-700">
              <PaperClipOutlined className="text-xl" />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <SmileOutlined className="text-xl" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center ml-3 transition-all">
            <SendOutlined className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to format last seen time
function formatLastSeen(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default MessageBox;
