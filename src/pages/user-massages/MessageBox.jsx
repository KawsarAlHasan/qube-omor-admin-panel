import React, { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, Typography, Spin, Input, message } from "antd";
import {
  MoreOutlined,
  PaperClipOutlined,
  SmileOutlined,
  SendOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useUserConversations } from "../../api/userApi";
import IsLoading from "../../components/IsLoading";
import socket from "../../socket";

const { Text } = Typography;
const { Search } = Input;

function MessageBox({ senderId }) {
  if (!senderId) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const [allMessages, setAllMessages] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messageAreaRef = useRef(null);
  const prevScrollHeightRef = useRef(0);

  const myID = "000000000000000000000001";
  const filter = { userId: senderId, page: currentPage, limit: 100 };

  const { userConversations, isLoading, isError, error, refetch } =
    useUserConversations(filter);

  // Pagination info
  const pagination = userConversations?.pagination;
  const hasMoreMessages = pagination?.current_page < pagination?.total_pages;

  // Socket connection and event handlers
  useEffect(() => {
    // Connect user to socket server
    socket.emit("userConnected", myID);

    // Handle incoming messages
    const handleReceiveMessage = (receivedMessage) => {
      console.log("Received message via socket:", receivedMessage);
      
      if (receivedMessage.senderId === senderId || receivedMessage.receiverId === myID) {
        const formattedMessage = {
          id: receivedMessage.id || Date.now().toString(),
          message: receivedMessage.message,
          sender_id: receivedMessage.senderId,
          receiver_id: receivedMessage.receiverId,
          created_at: receivedMessage.createdAt || new Date().toISOString(),
          is_read: receivedMessage.isRead || false,
          is_delivered: receivedMessage.isDelivered || true,
        };

        setAllMessages(prev => [...prev, formattedMessage]);
        
        // Auto scroll to bottom for new messages
        setTimeout(() => {
          scrollToBottom();
        }, 100);

        // Mark as read if message is from other user
        if (receivedMessage.senderId !== myID) {
          markMessageAsRead(receivedMessage.id);
        }
      }
    };

    // Handle message delivery status
    const handleMessageDelivered = (data) => {
      setAllMessages(prev =>
        prev.map(msg =>
          msg.id === data.messageId ? { ...msg, is_delivered: true } : msg
        )
      );
    };

    // Handle message read status
    const handleMessageRead = (data) => {
      setAllMessages(prev =>
        prev.map(msg =>
          msg.sender_id === myID && msg.receiver_id === data.senderId 
            ? { ...msg, is_read: true } 
            : msg
        )
      );
    };

    // Socket event listeners
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageDelivered", handleMessageDelivered);
    socket.on("messageRead", handleMessageRead);
    socket.on("messageError", (error) => {
      console.error("Socket message error:", error);
      message.error("Failed to send message");
      setIsSending(false);
    });

    // Cleanup
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageDelivered", handleMessageDelivered);
      socket.off("messageRead", handleMessageRead);
      socket.off("messageError");
    };
  }, [myID, senderId]);

  // Mark message as read
  const markMessageAsRead = useCallback(async (messageId) => {
    try {
      socket.emit("markAsRead", {
        messageId,
        readerId: myID,
        senderId: senderId
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  }, [myID, senderId]);

  // Mark conversation as read when scrolling to bottom
  const markConversationAsRead = useCallback(() => {
    const unreadMessages = allMessages.filter(
      msg => msg.sender_id === senderId && !msg.is_read
    );
    
    if (unreadMessages.length > 0) {
      unreadMessages.forEach(msg => {
        markMessageAsRead(msg.id);
      });
    }
  }, [allMessages, senderId, markMessageAsRead]);

  // Update messages when new data arrives from API
  useEffect(() => {
    if (userConversations?.message) {
      if (currentPage === 1) {
        // First load - replace all messages
        setAllMessages(userConversations.message);
      } else {
        // Load more - prepend old messages
        setAllMessages(prev => [
          ...userConversations.message,
          ...prev,
        ]);
      }
      setIsLoadingMore(false);
    }
  }, [userConversations, currentPage]);

  // Maintain scroll position when loading older messages
  useEffect(() => {
    if (messageAreaRef.current && currentPage > 1) {
      const newScrollHeight = messageAreaRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
      messageAreaRef.current.scrollTop = scrollDiff;
    }
  }, [allMessages]);

  // Auto scroll to bottom on first load
  useEffect(() => {
    if (messageAreaRef.current && currentPage === 1 && allMessages.length > 0) {
      scrollToBottom();
    }
  }, [allMessages, currentPage]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  };

  // Load more messages
  const loadMoreMessages = () => {
    if (!hasMoreMessages || isLoadingMore) return;
    
    setIsLoadingMore(true);
    prevScrollHeightRef.current = messageAreaRef.current?.scrollHeight || 0;
    setCurrentPage(prev => prev + 1);
  };

  // Infinite scroll handler
  const handleScroll = (e) => {
    const element = e.target;
    // When user scrolls to top (with 50px threshold)
    if (element.scrollTop < 50 && hasMoreMessages && !isLoadingMore) {
      loadMoreMessages();
    }

    // Mark as read when scrolling near bottom
    const isNearBottom = 
      element.scrollHeight - element.scrollTop <= element.clientHeight + 100;
    
    if (isNearBottom) {
      markConversationAsRead();
    }
  };

  // Send message handler
  const sendMessage = async (value) => {
    const messageText = value?.trim() || newMessage.trim();
    
    if (!messageText || isSending) return;

    setIsSending(true);
    
    const tempMessageId = Date.now().toString();
    const messageData = {
      id: tempMessageId,
      senderId: myID,
      receiverId: senderId,
      message: messageText,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    const optimisticMessage = {
      id: tempMessageId,
      message: messageText,
      sender_id: myID,
      receiver_id: senderId,
      created_at: new Date().toISOString(),
      is_read: false,
      is_delivered: false,
    };

    setAllMessages(prev => [...prev, optimisticMessage]);
    setNewMessage("");
    
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    try {
      // Emit message via socket
      socket.emit("sendMessage", messageData);
      
      // Refetch to get actual message from server
      setTimeout(() => {
        refetch();
      }, 500);
      
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Failed to send message");
      
      // Remove optimistic message on error
      setAllMessages(prev => 
        prev.filter(msg => msg.id !== tempMessageId)
      );
    } finally {
      setIsSending(false);
    }
  };

  // Handle input key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading && currentPage === 1) {
    return <IsLoading />;
  }

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const date = new Date(msg.created_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateLabel;
      if (date.toDateString() === today.toDateString()) {
        dateLabel = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(msg);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(allMessages);

  // Format time from ISO string
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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
                  src={userConversations?.profile}
                  alt={userConversations?.user_name}
                  className="object-cover"
                />
              }
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                userConversations?.is_active ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
          </div>
          <div className="ml-3">
            <Text strong className="text-lg block">
              {userConversations?.user_name}
            </Text>
            <Text type="secondary" className="text-xs flex items-center">
              {userConversations?.is_active
                ? "Online"
                : `Last seen ${formatLastSeen(
                    userConversations?.last_time_active
                  )}`}
            </Text>
          </div>
        </div>
        <div className="bg-gray-100 rounded-full p-2 cursor-pointer">
          <MoreOutlined className="text-lg" />
        </div>
      </div>

      {/* Message Area */}
      <div
        ref={messageAreaRef}
        onScroll={handleScroll}
        className="flex-1 p-6 overflow-y-auto bg-gray-50"
      >
        {/* Loading indicator for infinite scroll */}
        {isLoadingMore && (
          <div className="flex justify-center mb-4">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            <Text className="ml-2 text-gray-500">Loading older messages...</Text>
          </div>
        )}

        {allMessages.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <React.Fragment key={date}>
                <div className="text-center text-gray-500 text-sm my-2">
                  {date}
                </div>

                {msgs?.map((msg, index) => {
                  const isMyMessage = msg.sender_id === myID;
                  return (
                    <div
                      key={`${msg.id}-${index}`}
                      className={`flex ${
                        isMyMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`${
                          isMyMessage
                            ? "bg-blue-500 text-white rounded-xl rounded-tr-none"
                            : "bg-white text-gray-800 rounded-xl rounded-tl-none shadow-sm"
                        } px-4 py-2 max-w-xs lg:max-w-md`}
                      >
                        <p className="break-words">{msg.message}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <Text
                            className={`${
                              isMyMessage ? "text-blue-100" : "text-gray-500"
                            } text-xs`}
                          >
                            {formatTime(msg.created_at)}
                          </Text>
                          {isMyMessage && (
                            <span className="text-xs ml-1">
                              {msg.is_read ? "✓✓" : msg.is_delivered ? "✓" : "⏱"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Pagination Info */}
            {pagination && (
              <div className="text-center text-gray-400 text-xs mt-4">
                Page {pagination.current_page} of {pagination.total_pages} • 
                Total: {pagination.total_messages} messages
              </div>
            )}
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
                Send your first message to{" "}
                {userConversations?.user_name?.split(" ")[0]}
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
          
          <Search
            placeholder="Type a message..."
            allowClear
            enterButton={
              <div className="flex items-center">
                {isSending ? (
                  <LoadingOutlined className="text-white" />
                ) : (
                  <SendOutlined className="text-white" />
                )}
              </div>
            }
            size="large"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onSearch={sendMessage}
            onKeyPress={handleKeyPress}
            loading={isSending}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}

// Helper function to format last seen time
function formatLastSeen(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default MessageBox;