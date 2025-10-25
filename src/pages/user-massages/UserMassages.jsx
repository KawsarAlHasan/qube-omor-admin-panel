import { Typography } from "antd";
import MessageBox from "./MessageBox";
import SidebarForMessages from "./SidebarForMessages";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const { Text } = Typography;

function UserMassages() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const senderId = params.get("sender");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleUserSelect = (user) => {
    // Handle user selection
    console.log("Selected user:", user);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-1 md:gap-3 h-[83vh]">
        <div className="col-span-3 md:col-span-1">
          <SidebarForMessages
            isMobile={isMobile}
            onUserSelect={handleUserSelect}
          />
        </div>
        <div className="col-span-3 md:col-span-2">
          {senderId ? (
            <MessageBox user={senderId} />
          ) : (
            <div className="flex flex-col h-full">
              {/* <div className="p-4 border-b border-gray-200 bg-gray-50"></div> */}
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
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
                    Select a conversation
                  </Text>
                  <Text type="secondary">
                    Choose a contact from the list to start chatting
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserMassages;
