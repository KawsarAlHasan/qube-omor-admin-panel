import React, { useState, useEffect, useRef, use } from "react";
import {
  Avatar,
  Typography,
  Spin,
  Input,
  message as antdMessage,
  Modal,
  Progress,
  Tag,
} from "antd";
import {
  MoreOutlined,
  PaperClipOutlined,
  SmileOutlined,
  SendOutlined,
  LoadingOutlined,
  FileOutlined,
  CloseOutlined,
  DownloadOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useUserConversations } from "../../api/userApi";
import IsLoading from "../../components/IsLoading";
import socket from "../../socket";
import { API } from "../../api/api";

const { Text } = Typography;
const { TextArea } = Input;

function MessageBox({ senderId }) {
  if (!senderId) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const [allMessages, setAllMessages] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewModal, setPreviewModal] = useState({
    visible: false,
    url: "",
    type: "",
  });

  const messageAreaRef = useRef(null);
  const prevScrollHeightRef = useRef(0);
  const fileInputRef = useRef(null);

  const myID = "000000000000000000000001";
  const filter = { userId: senderId, page: currentPage, limit: 30 };

  const { userConversations, isLoading, isError, error, refetch } =
    useUserConversations(filter);

  const pagination = userConversations?.pagination;
  const hasMoreMessages = pagination?.current_page < pagination?.total_pages;

  // File validation
  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "application/zip",
      "application/x-rar-compressed",
    ];

    if (!allowedTypes.includes(file.type)) {
      antdMessage.error("This file type is not supported");
      return false;
    }

    if (file.size > maxSize) {
      antdMessage.error("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      e.target.value = "";
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    refetch();
  }, [senderId]);

  // Upload file to server
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const response = await API.post(`/message/file-upload`, formData);

      setIsUploading(false);
      setUploadProgress(0);
      return response.data.fileUrl;
    } catch (error) {
      console.error("File upload error:", error);
      setIsUploading(false);
      setUploadProgress(0);
      throw error;
    }
  };

  // Mark messages as read when component mounts or senderId changes
  useEffect(() => {
    if (senderId) {
      // Emit adminMessageRead event when opening chat
      socket.emit("adminMessageRead", {
        userId: senderId,
      });
    }
  }, [senderId]);

  // Socket connection and event handlers
  useEffect(() => {
    socket.emit("userConnected", myID);

    const handleReceiveMessage = (receivedMessage) => {
      console.log("Received message via socket:", receivedMessage);

      const isMessageForThisChat =
        (receivedMessage.senderId === senderId &&
          receivedMessage.receiverId === myID) ||
        (receivedMessage.senderId === myID &&
          receivedMessage.receiverId === senderId);

      if (isMessageForThisChat) {
        const formattedMessage = {
          id:
            receivedMessage._id || receivedMessage.id || Date.now().toString(),
          message: receivedMessage.message,
          file: receivedMessage.file,
          sender_id: receivedMessage.senderId,
          receiver_id: receivedMessage.receiverId,
          created_at: receivedMessage.createdAt || new Date().toISOString(),
          is_read: receivedMessage.isRead || false,
          is_delivered: receivedMessage.isDelivered || true,
        };

        setAllMessages((prev) => [...prev, formattedMessage]);

        // Mark messages as read when receiving new messages
        if (receivedMessage.senderId === senderId) {
          socket.emit("adminMessageRead", {
            userId: senderId,
          });
        }

        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    };

    const handleMessageRead = (data) => {
      console.log("Messages marked as read:", data);
      // You can update local state if needed to show read status
      // For example, update the is_read status of messages
      setAllMessages((prev) =>
        prev.map((msg) =>
          msg.sender_id === senderId ? { ...msg, is_read: true } : msg
        )
      );
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageError", (error) => {
      console.error("Socket message error:", error);
      antdMessage.error("Failed to send message");
      setIsSending(false);
    });

    // Listen for message read confirmation
    socket.on("messageReadConfirmation", handleMessageRead);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageError");
      socket.off("messageReadConfirmation", handleMessageRead);
    };
  }, [myID, senderId]);

  // Mark messages as read when scrolling to bottom (user sees the messages)
  useEffect(() => {
    if (messageAreaRef.current) {
      const element = messageAreaRef.current;
      const isNearBottom =
        element.scrollHeight - element.scrollTop <= element.clientHeight + 100;

      if (isNearBottom && senderId) {
        // Emit adminMessageRead when user is viewing latest messages
        socket.emit("adminMessageRead", {
          userId: senderId,
        });
      }
    }
  }, [allMessages, senderId]);

  useEffect(() => {
    if (userConversations?.message) {
      if (currentPage === 1) {
        setAllMessages(userConversations.message);

        // Mark messages as read when loading new conversations
        if (senderId) {
          socket.emit("adminMessageRead", {
            userId: senderId,
          });
        }
      } else {
        setAllMessages((prev) => [...userConversations.message, ...prev]);
      }
      setIsLoadingMore(false);
    }
  }, [userConversations, currentPage]);

  useEffect(() => {
    if (messageAreaRef.current && currentPage > 1) {
      const newScrollHeight = messageAreaRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
      messageAreaRef.current.scrollTop = scrollDiff;
    }
  }, [allMessages]);

  useEffect(() => {
    if (messageAreaRef.current && currentPage === 1 && allMessages.length > 0) {
      scrollToBottom();

      // Mark messages as read after scrolling to bottom
      if (senderId) {
        setTimeout(() => {
          socket.emit("adminMessageRead", {
            userId: senderId,
          });
        }, 500);
      }
    }
  }, [allMessages, currentPage]);

  const scrollToBottom = () => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  };

  const loadMoreMessages = () => {
    if (!hasMoreMessages || isLoadingMore) return;

    setIsLoadingMore(true);
    prevScrollHeightRef.current = messageAreaRef.current?.scrollHeight || 0;
    setCurrentPage((prev) => prev + 1);
  };

  const handleScroll = (e) => {
    const element = e.target;
    if (element.scrollTop < 50 && hasMoreMessages && !isLoadingMore) {
      loadMoreMessages();
    }

    const isNearBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 100;

    // Mark messages as read when user scrolls to bottom (views latest messages)
    if (isNearBottom && senderId) {
      socket.emit("adminMessageRead", {
        userId: senderId,
      });
    }
  };

  // Send message with file
  const sendMessage = async () => {
    const messageText = newMessage.trim();

    if (!messageText && !selectedFile) {
      antdMessage.warning("Please type a message or select a file");
      return;
    }

    if (isSending || isUploading) return;

    setIsSending(true);

    try {
      let fileUrl = null;

      // Upload file if selected
      if (selectedFile) {
        try {
          fileUrl = await uploadFile(selectedFile);
        } catch (error) {
          antdMessage.error("Failed to upload file");
          setIsSending(false);
          return;
        }
      }

      const tempMessageId = Date.now().toString();
      const messageData = {
        id: tempMessageId,
        senderId: myID,
        receiverId: senderId,
        message: messageText || null,
        file: fileUrl,
        createdAt: new Date().toISOString(),
      };

      // Optimistic update
      const optimisticMessage = {
        id: tempMessageId,
        message: messageText,
        file: fileUrl,
        sender_id: myID,
        receiver_id: senderId,
        created_at: new Date().toISOString(),
        is_read: false,
        is_delivered: false,
      };

      setAllMessages((prev) => [...prev, optimisticMessage]);
      setNewMessage("");
      removeSelectedFile();

      setTimeout(() => {
        scrollToBottom();
      }, 100);

      // Emit message via socket
      socket.emit("sendMessage", messageData);

      setTimeout(() => {
        refetch();
      }, 500);
    } catch (error) {
      console.error("Error sending message:", error);
      antdMessage.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Get file icon based on type
  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return <FileOutlined />;

    const ext = fileUrl.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
      return "🖼️";
    } else if (["pdf"].includes(ext)) {
      return "📄";
    } else if (["doc", "docx"].includes(ext)) {
      return "📝";
    } else if (["xls", "xlsx"].includes(ext)) {
      return "📊";
    } else if (["zip", "rar"].includes(ext)) {
      return "📦";
    }
    return "📎";
  };

  // Check if file is image
  const isImageFile = (fileUrl) => {
    if (!fileUrl) return false;
    const ext = fileUrl.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
  };

  // Open preview modal
  const openPreview = (fileUrl) => {
    setPreviewModal({
      visible: true,
      url: fileUrl,
      type: isImageFile(fileUrl) ? "image" : "file",
    });
  };

  if (isLoading && currentPage === 1) {
    return <IsLoading />;
  }

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

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col h-[83vh]">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <div className="flex items-center">
          <div className="relative">
            <Avatar
              size={48}
              icon={!userConversations?.profile && <UserOutlined />}
              src={userConversations?.profile}
              alt={userConversations?.user_name}
              className="object-cover"
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
        <Tag className="px-2 py-1" color="blue">
          {userConversations?.role}{" "}
        </Tag>
      </div>

      {/* Message Area */}
      <div
        ref={messageAreaRef}
        onScroll={handleScroll}
        className="flex-1 p-6 overflow-y-auto bg-gray-50"
      >
        {isLoadingMore && (
          <div className="flex justify-center mb-4">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
            <Text className="ml-2 text-gray-500">
              Loading older messages...
            </Text>
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
                        {/* File attachment */}
                        {msg.file && (
                          <div className="mb-2">
                            {isImageFile(msg.file) ? (
                              <div
                                className="cursor-pointer relative group"
                                onClick={() => openPreview(msg.file)}
                              >
                                <img
                                  src={msg.file}
                                  alt="attachment"
                                  className="rounded-lg max-w-full h-auto max-h-64 object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                                  <EyeOutlined className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`flex items-center gap-2 p-3 rounded-lg ${
                                  isMyMessage ? "bg-blue-600" : "bg-gray-100"
                                }`}
                              >
                                <span className="text-2xl">
                                  {getFileIcon(msg.file)}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm font-medium truncate ${
                                      isMyMessage
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {msg.file.split("/").pop()}
                                  </p>
                                </div>
                                <a
                                  href={msg.file}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={
                                    isMyMessage ? "text-white" : "text-blue-500"
                                  }
                                >
                                  <DownloadOutlined />
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Message text */}
                        {msg.message && (
                          <p className="break-words">{msg.message}</p>
                        )}

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
                              {msg.is_read
                                ? "✓✓"
                                : msg.is_delivered
                                ? "✓"
                                : "⏱"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
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
        {/* File Preview */}
        {selectedFile && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="preview"
                    className="w-12 h-12 rounded object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-2xl">
                      {getFileIcon(selectedFile.name)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={removeSelectedFile}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <CloseOutlined />
              </button>
            </div>
            {isUploading && (
              <Progress
                percent={uploadProgress}
                size="small"
                className="mt-2"
              />
            )}
          </div>
        )}

        <div className="flex items-end gap-2">
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isSending || isUploading}
            >
              <PaperClipOutlined className="text-xl" />
            </button>
          </div>

          <div className="flex-1 flex gap-2">
            <TextArea
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="flex-1"
              disabled={isSending || isUploading}
            />
            <button
              onClick={sendMessage}
              disabled={
                isSending ||
                isUploading ||
                (!newMessage.trim() && !selectedFile)
              }
              className={`px-4 py-2 rounded-lg flex items-center justify-center transition-colors ${
                isSending ||
                isUploading ||
                (!newMessage.trim() && !selectedFile)
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isSending || isUploading ? (
                <LoadingOutlined className="text-white" />
              ) : (
                <SendOutlined className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        visible={previewModal.visible}
        footer={null}
        onCancel={() => setPreviewModal({ visible: false, url: "", type: "" })}
        width={800}
        centered
      >
        {previewModal.type === "image" ? (
          <img src={previewModal.url} alt="preview" className="w-full h-auto" />
        ) : (
          <div className="text-center p-8">
            <FileOutlined className="text-6xl text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Preview not available</p>
            <a
              href={previewModal.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <DownloadOutlined /> Download File
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}

function formatLastSeen(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default MessageBox;
