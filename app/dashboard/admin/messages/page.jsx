"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiMessageSquare,
  FiMoreVertical,
  FiPaperclip,
  FiSearch,
  FiSend,
  FiChevronLeft,
  FiLoader,
  FiEdit2,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useWebSocket } from "@/context/WebSocketContext";

// --- Skeleton Component ---
const MessagePageSkeleton = () => (
  <div className="flex-1 flex h-full bg-slate-900 animate-pulse">
    <div className="w-full md:w-80 flex-shrink-0 flex flex-col border-r border-slate-700">
      <div className="p-3 border-b border-slate-700">
        <div className="h-10 bg-slate-700 rounded-lg"></div>
      </div>
      <div className="flex-1 p-2 space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-2">
            <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="hidden md:flex flex-1 flex-col">
      <div className="p-3 border-b border-slate-700 flex items-center space-x-3">
        <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="h-3 bg-slate-700 rounded w-1/6"></div>
        </div>
      </div>
      <div className="flex-1"></div>
      <div className="p-3 border-t border-slate-700">
        <div className="h-10 bg-slate-800 rounded-full"></div>
      </div>
    </div>
  </div>
);

// --- ThreadList Component ---
const ThreadList = ({
  threads,
  selectedThread,
  onSelect,
  searchQuery,
  onSearchChange,
}) => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col h-full border-r border-slate-700 bg-slate-900">
      {/* Search bar - now without sticky positioning */}
      <div className="p-3 border-b border-slate-700 bg-slate-900">
        <div className="relative">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none text-slate-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-400"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {threads.map((thread) => {
          const otherParticipant = thread.participants.find(
            (p) => p._id !== session?.user.id
          );
          const lastMessage = thread.lastMessage;
          const isUnread =
            lastMessage?.sender !== session?.user.id &&
            !lastMessage?.recipient?.read;
          return (
            <div
              key={thread._id}
              onClick={() => onSelect(thread)}
              className={`p-3 border-b border-slate-700 cursor-pointer transition-colors ${
                selectedThread?._id === thread._id
                  ? "bg-slate-800"
                  : "hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center font-medium overflow-hidden">
                    {otherParticipant?.profilePhoto ? (
                      <Image
                        src={otherParticipant.profilePhoto}
                        alt={otherParticipant.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-indigo-400">
                        {otherParticipant?.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                  {otherParticipant?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-medium text-white truncate pr-2">
                      {otherParticipant?.name || "Unknown"}
                    </h3>
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      {lastMessage
                        ? formatDistanceToNow(new Date(thread.updatedAt), {
                            addSuffix: true,
                          })
                        : ""}
                    </span>
                  </div>
                  {lastMessage && (
                    <p
                      className={`text-xs mt-1 truncate ${
                        isUnread ? "text-white font-medium" : "text-slate-400"
                      }`}
                    >
                      {lastMessage.sender === session?.user.id && "You: "}
                      {lastMessage.content?.text}
                    </p>
                  )}
                </div>
                {isUnread && (
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full self-center flex-shrink-0 ml-2"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- MessagePanel Component ---
const MessagePanel = ({
  thread,
  messages,
  onBack,
  onSendMessage,
  newMessage,
  onNewMessageChange,
  editingMessage,
  setEditingMessage,
  onSaveEdit,
}) => {
  const { data: session } = useSession();
  const messagesEndRef = useRef(null);
  const editInputRef = useRef(null);
  const [editedContent, setEditedContent] = useState("");
  const otherParticipant = thread.participants.find(
    (p) => p._id !== session?.user.id
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    if (editingMessage && editInputRef.current) {
      setEditedContent(editingMessage.content.text);
      editInputRef.current.focus();
    }
  }, [editingMessage]);

  const handleKeyDown = (e, msg) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSaveEdit(msg._id, editedContent);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditingMessage(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-800/30">
      <div className="p-3 border-b border-slate-700 bg-slate-900 z-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="md:hidden p-1 text-slate-400 hover:text-white"
          >
            <FiChevronLeft size={20} />
          </button>
          <div className="relative w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0">
            {otherParticipant?.profilePhoto ? (
              <Image
                src={otherParticipant.profilePhoto}
                alt="User"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium">
                {otherParticipant?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            {otherParticipant?.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">
              {otherParticipant?.name || "Unknown"}
            </h3>
            <p className="text-xs text-slate-400">
              {otherParticipant?.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white">
          <FiMoreVertical />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => {
          const isUserMessage = msg.sender._id === session?.user.id;
          const isEditing = editingMessage?._id === msg._id;
          return (
            <div
              key={msg._id || msg.tempId}
              className={`group flex items-center gap-2 ${
                isUserMessage ? "justify-end" : "justify-start"
              }`}
            >
              {isUserMessage && !isEditing && msg.status !== "sending" && (
                <button
                  onClick={() => setEditingMessage(msg)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                >
                  <FiEdit2 size={14} />
                </button>
              )}
              <div
                className={`flex items-end gap-2 ${
                  isUserMessage ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2 ${
                    isUserMessage
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-slate-700 text-white rounded-bl-none"
                  }`}
                >
                  {isEditing ? (
                    <div>
                      <textarea
                        ref={editInputRef}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, msg)}
                        className="w-full bg-transparent text-white outline-none resize-none text-sm p-0"
                        rows={Math.max(1, editedContent.split("\n").length)}
                      />
                      <p className="text-xs text-slate-300 mt-1">
                        escape to cancel • enter to save
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">
                      {msg.content.text}
                    </p>
                  )}
                  <p className="text-xs mt-1 opacity-70 text-right">
                    {msg.status === "sending"
                      ? "sending..."
                      : formatDistanceToNow(new Date(msg.createdAt), {
                          addSuffix: true,
                        })}
                    {msg.isEdited && <span className="ml-1">(edited)</span>}
                  </p>
                </div>
                {msg.status === "sending" && isUserMessage && (
                  <FiLoader className="animate-spin text-slate-400" size={16} />
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-slate-700 bg-slate-900">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-400 hover:text-white">
            <FiPaperclip />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            className={`p-2.5 rounded-full transition-colors ${
              newMessage.trim()
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- EmptyState Component ---
const EmptyState = ({ onShowThreads }) => (
  <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 text-center p-6">
    <FiMessageSquare className="mx-auto text-slate-600" size={48} />
    <h3 className="mt-4 text-lg font-medium text-white">
      Select a conversation
    </h3>
    <p className="mt-2 text-slate-400">
      Choose an existing conversation or start a new one.
    </p>
    <button
      onClick={onShowThreads}
      className="md:hidden mt-6 p-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700"
    >
      View Conversations
    </button>
  </div>
);

export default function MessagePage() {
  const { data: session } = useSession();
  const { isConnected, lastEvent, sendMessage } = useWebSocket();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showThreadList, setShowThreadList] = useState(true);
  const [editingMessage, setEditingMessage] = useState(null);

  const threadIdFromURL = searchParams.get("threadId");
  const selectedThreadRef = useRef(selectedThread);

  useEffect(() => {
    selectedThreadRef.current = selectedThread;
  }, [selectedThread]);

  const handleThreadSelect = useCallback(
    (thread) => {
      if (selectedThread?._id !== thread._id) {
        setSelectedThread(thread);
        setMessages([]); // Clear messages to avoid showing stale data
        setShowThreadList(false);
        setEditingMessage(null);

        // Update URL with new threadId
        router.replace(pathname, {
          scroll: false,
        });

        // Mark messages in this thread as read
        if (isConnected && session) {
          sendMessage("mark_thread_as_read", {
            threadId: thread._id,
            userId: session.user.id,
          });
        }
      }
    },
    [
      pathname,
      router,
      isConnected,
      sendMessage,
      session,
      selectedThread,
      searchParams,
    ]
  );

  useEffect(() => {
    if (!session) return;

    const fetchThreads = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/threads");
        if (!response.ok) throw new Error("Failed to fetch threads");
        const data = await response.json();
        setThreads(data);
      } catch (error) {
        toast.error("Failed to load your conversations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [session]);

  useEffect(() => {
    if (threads.length > 0 && threadIdFromURL) {
      const foundThread = threads.find((t) => t._id === threadIdFromURL);
      if (foundThread && selectedThread?._id !== threadIdFromURL) {
        handleThreadSelect(foundThread);
      }
    }
  }, [threads, threadIdFromURL, handleThreadSelect, selectedThread?._id]);

  useEffect(() => {
    if (!lastEvent || !session) return;
    const { type, payload } = lastEvent;

    switch (type) {
      case "new_message": {
        const { message, thread: updatedThread } = payload;
        if (!message || !updatedThread) return;

        if (selectedThreadRef.current?._id === message.threadId) {
          if (message.sender._id === session.user.id && message.tempId) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.tempId === message.tempId
                  ? { ...message, status: "sent" }
                  : msg
              )
            );
          } else if (message.sender._id !== session.user.id) {
            setMessages((prev) => [...prev, { ...message, status: "sent" }]);
          }
        } else {
          if (message.sender._id !== session.user.id) {
            toast.success(`New message from ${message.sender.name}`, {
              description: message.content.text,
              action: {
                label: "View",
                onClick: () =>
                  router.push(`${pathname}?threadId=${message.threadId}`),
              },
            });
          }
        }
        break;
      }
      case "message_updated": {
        if (selectedThreadRef.current?._id === payload.threadId) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === payload._id ? { ...payload, status: "sent" } : msg
            )
          );
        }
        break;
      }
      case "thread_read_ack": {
        const { threadId } = payload;
        setThreads((prev) =>
          prev.map((t) =>
            t._id === threadId && t.lastMessage
              ? {
                  ...t,
                  lastMessage: {
                    ...t.lastMessage,
                    recipient: { ...t.lastMessage.recipient, read: true },
                  },
                }
              : t
          )
        );
        break;
      }
    }
  }, [lastEvent, session, router, pathname]);

  useEffect(() => {
    if (!selectedThread) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/threads/${selectedThread._id}/messages`
        );
        const data = await response.json();
        setMessages(data.map((msg) => ({ ...msg, status: "sent" })));
      } catch (error) {
        toast.error("Failed to load messages.");
      }
    };
    fetchMessages();
  }, [selectedThread]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThread || !isConnected) return;
    const tempId = Date.now().toString();

    setMessages((prev) => [
      ...prev,
      {
        tempId,
        _id: tempId,
        threadId: selectedThread._id,
        sender: {
          _id: session.user.id,
          name: session.user.name,
          profilePhoto: session.user.image,
        },
        content: { text: newMessage },
        createdAt: new Date().toISOString(),
        status: "sending",
      },
    ]);

    sendMessage("new_message", {
      threadId: selectedThread._id,
      content: newMessage.trim(),
      senderId: session.user.id,
      tempId: tempId,
    });

    setNewMessage("");
  };

  const handleSaveEdit = (messageId, newContent) => {
    if (!newContent.trim() || !isConnected) return;
    sendMessage("edit_message", {
      messageId,
      newContent: newContent.trim(),
      senderId: session.user.id,
      threadId: selectedThread._id,
    });
    setEditingMessage(null);
  };

  const filteredThreads = threads.filter((thread) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const otherParticipant = thread.participants.find(
      (p) => p._id !== session?.user.id
    );
    return otherParticipant?.name?.toLowerCase().includes(query) || false;
  });

  if (isLoading) return <MessagePageSkeleton />;

  return (
    <div className="flex h-full bg-slate-900 overflow-hidden">
      {/* Thread List - Full width on mobile, hidden when thread is selected */}
      <div
        className={`flex-shrink-0 h-full w-full md:w-80 transition-transform duration-300 ease-in-out ${
          showThreadList ? "block" : "hidden md:block"
        }`}
      >
        <ThreadList
          threads={filteredThreads}
          selectedThread={selectedThread}
          onSelect={(thread) => {
            handleThreadSelect(thread);
            // On mobile, hide thread list when thread is selected
            if (window.innerWidth < 768) {
              setShowThreadList(false);
            }
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Message Panel - Full width on mobile when thread is selected */}
      <div
        className={`flex-1 flex flex-col h-full ${
          !showThreadList || selectedThread ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedThread ? (
          <MessagePanel
            thread={selectedThread}
            messages={messages}
            onBack={() => {
              setShowThreadList(true);
              setSelectedThread(null);
              setMessages([]);
            }}
            onSendMessage={handleSendMessage}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            editingMessage={editingMessage}
            setEditingMessage={setEditingMessage}
            onSaveEdit={handleSaveEdit}
          />
        ) : (
          <EmptyState onShowThreads={() => setShowThreadList(true)} />
        )}
      </div>
    </div>
  );
}
