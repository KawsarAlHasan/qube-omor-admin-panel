import { useState, useEffect } from "react";
import { Avatar, Badge, Input, List, Typography, Drawer, Button } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  MoreOutlined,
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import { useUsersForMessages } from "../../api/userApi";
import socket from "../../socket";

const { Search } = Input;
const { Text } = Typography;

function SidebarForMessages({ isMobile, onUserSelect }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { usersForMessages, isLoading, isError, error, refetch } =
    useUsersForMessages({
      search: searchQuery,
    });

  const myID = "000000000000000000000001";

  // Format timestamp to relative time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const onSearch = (value) => {
    setSearchQuery(value);
  };

  const handleUserSelect = async (user) => {
    const senderId = user.id;
    searchParams.set("sender", senderId);
    setSearchParams(searchParams);
    setSelectedUser(user);

    if (isMobile) {
      setDrawerVisible(false);
    }

    // Call the parent callback if provided
    if (onUserSelect) {
      onUserSelect(user);
    }

    try {
      socket.emit("adminMessageRead", {
        userId: senderId,
      });
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  // Mobile drawer toggle
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  // Connect user to socket server
  useEffect(() => {
    socket.emit("userConnected", myID);
  }, [myID]);

  socket.on(`newMessage::${myID}`, (message) => {
    console.log("Testing:", message);
  });

  // socket.on(`getMessage::${myID}`, (message) => {
  //   console.log("New message received testing:", message);
  //   refetch();
  // });

  // useEffect(() => {
  //   socket.on("receiveMessage", (message) => {
  //     console.log("New message received:", message);
  //     refetch();
  //   });

  //   return () => {
  //     socket.off("receiveMessage");
  //   };
  // }, [refetch]);

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Link
            to={`/user-massages`}
            className="text-xl font-semibold text-center flex-1"
          >
            Users Messages (13)
          </Link>
          {isMobile && (
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={toggleDrawer}
              className="ml-2"
            />
          )}
        </div>

        {/* Search Bar */}
        <div className="p-2">
          <Search
            placeholder="Search sender.."
            onSearch={onSearch}
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            prefix={<SearchOutlined />}
            className="w-full"
            size={isMobile ? "large" : "middle"}
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-hidden">
        <div
          className="overflow-y-auto flex-1 min-h-[69vh]"
          style={{ maxHeight: "calc(80vh - 100px)" }}
        >
          <List
            itemLayout="horizontal"
            dataSource={usersForMessages}
            loading={isLoading}
            renderItem={(user) => (
              <List.Item
                className={`p-3 mx-2 my-1 rounded-lg border-0 hover:bg-gray-50 cursor-pointer transition-all ${
                  selectedUser?.id === user.id
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                } ${isMobile ? "p-4" : "p-3"}`}
                onClick={() => handleUserSelect(user)}
                extra={
                  <div className="flex flex-col items-end">
                    <Text type="secondary" className="text-xs">
                      {formatTime(user.last_message_time)}
                    </Text>
                    {user.un_read_message > 0 && (
                      <Badge
                        count={user.un_read_message}
                        style={{ backgroundColor: "#1890ff" }}
                        className="mt-1"
                        size={isMobile ? "default" : "small"}
                      />
                    )}
                  </div>
                }
              >
                <List.Item.Meta
                  avatar={
                    <div className="relative">
                      <Badge
                        dot
                        color={user.is_active ? "#52c41a" : "#f5222d"}
                        offset={isMobile ? [-5, 40] : [-5, 35]}
                        size={isMobile ? "default" : "small"}
                      >
                        <Avatar
                          size={isMobile ? 56 : 50}
                          icon={user?.profile_image === "" && <UserOutlined />}
                          src={user?.profile_image}
                          alt={user?.name}
                          className="object-cover"
                        />
                      </Badge>
                    </div>
                  }
                  title={
                    <div className="flex items-center">
                      <Text
                        strong
                        className={`${
                          isMobile ? "text-lg" : "text-base"
                        } truncate max-w-[120px]`}
                      >
                        {user.name}
                      </Text>
                    </div>
                  }
                  description={
                    <div className="flex items-center mt-1">
                      {!user.is_active && (
                        <ClockCircleOutlined
                          className="text-gray-400 mr-1"
                          style={{ fontSize: isMobile ? 14 : 12 }}
                        />
                      )}
                      <Text
                        ellipsis
                        className={`${
                          isMobile ? "text-base" : "text-sm"
                        } max-w-[150px]`}
                        type="secondary"
                      >
                        {user.last_message}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
            locale={{ emptyText: "No conversations found" }}
          />
        </div>
      </div>
    </div>
  );

  // Desktop version
  if (!isMobile) {
    return (
      <div className="h-full">
        <div className=" bg-white border-r h-full flex flex-col">
          {sidebarContent}
        </div>
      </div>
    );
  }

  // Mobile version with drawer
  return (
    <>
      {/* Mobile Header Button */}
      <div className="bg-white p-3 border-b flex items-center justify-between lg:hidden">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={toggleDrawer}
          size="large"
        >
          Conversations
        </Button>
        <Badge count={13} style={{ backgroundColor: "#1890ff" }} />
      </div>

      {/* Drawer for mobile */}
      <Drawer
        placement="left"
        onClose={toggleDrawer}
        open={drawerVisible}
        width="100%"
        height="100%"
        bodyStyle={{ padding: 0 }}
        className="mobile-messages-drawer"
        styles={{
          body: { padding: 0 },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
}

export default SidebarForMessages;
