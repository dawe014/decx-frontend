"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
} from "react";
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
import { format, formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWebSocket } from "@/context/WebSocketContext";

// --- Skeleton Components (unchanged) ---
function ThreadListSkeletonItem() {
  return (
    <div className="p-3 flex items-start space-x-3">
      <div className="w-12 h-12 rounded-full bg-slate-700"></div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex justify-between items-baseline">
          <div className="h-4 w-2/3 bg-slate-700 rounded"></div>
          <div className="h-3 w-1/4 bg-slate-700 rounded"></div>
        </div>
        <div className="h-3 w-full bg-slate-700 rounded"></div>
      </div>
    </div>
  );
}

function MessagingSkeleton() {
  return (
    <div className="flex flex-1 h-screen bg-slate-900 animate-pulse">
      <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-700 bg-slate-800/50">
        <div className="p-4 border-b border-slate-700">
          <div className="h-10 bg-slate-700 rounded-lg"></div>
        </div>
        <div className="flex-1">
          {[...Array(8)].map((_, i) => (
            <ThreadListSkeletonItem key={i} />
          ))}
        </div>
      </div>
      <div className="flex-1 flex-col hidden md:flex">
        <div className="p-3 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-700"></div>
            <div className="h-5 w-32 bg-slate-700 rounded-md"></div>
          </div>
          <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
        </div>
        <div className="flex-1"></div>
        <div className="p-3 border-t border-slate-700 flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
          <div className="h-10 flex-1 bg-slate-700 rounded-full"></div>
          <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

// --- Main Content Component ---
function MessageContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isConnected, lastEvent, sendMessage } = useWebSocket();

  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const messagePanelRef = useRef(null);
  const editInputRef = useRef(null);
  const selectedThreadRef = useRef(selectedThread);
  const isInitialScroll = useRef(true); // To handle initial vs. subsequent scrolling
  const threadIdFromURL = searchParams.get("threadId");

  useEffect(() => {
    selectedThreadRef.current = selectedThread;
  }, [selectedThread]);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // FIX 1: Stabilize handleThreadSelect by using a ref, preventing fetchThreads from re-running
  const handleThreadSelect = useCallback(
    (thread, updateUrl = true) => {
      if (selectedThreadRef.current?._id === thread._id) return;

      isInitialScroll.current = true; // Mark that we need an instant scroll for this new thread
      setSelectedThread(thread);
      setEditingMessage(null);

      if (updateUrl) {
        const newUrl = `/messages?threadId=${thread._id}`;
        router.push(newUrl, { scroll: false });
      }

      const lastMessage = thread.lastMessage;
      const isUnread =
        lastMessage?.sender?._id !== session?.user.id &&
        !lastMessage?.recipient?.read;

      if (isConnected && isUnread) {
        sendMessage("mark_thread_as_read", {
          threadId: thread._id,
          userId: session.user.id,
        });
      }
    },
    [isConnected, sendMessage, router, session?.user.id]
  ); // Removed selectedThread from dependencies

  // This effect now only runs on initial load or if the URL param changes
  useEffect(() => {
    if (!session) return;
    const fetchThreads = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/threads");
        if (!response.ok) throw new Error("Failed to fetch threads");
        const data = await response.json();
        setThreads(data);

        if (threadIdFromURL) {
          const foundThread = data.find((t) => t._id === threadIdFromURL);
          if (foundThread) {
            handleThreadSelect(foundThread, false);
          }
        }
      } catch (error) {
        toast.error("Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    };
    fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, threadIdFromURL]); // handleThreadSelect is stable, but we only want this to run on load

  // Fetch messages for the selected thread
  useEffect(() => {
    if (!selectedThread?._id) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/threads/${selectedThread._id}/messages`
        );
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data.map((msg) => ({ ...msg, status: "sent" })));
      } catch (error) {
        toast.error("Failed to load messages");
      }
    };
    fetchMessages();
  }, [selectedThread?._id]);

  // WebSocket event handler
  useEffect(() => {
    if (!lastEvent || !session) return;
    const { type, payload } = lastEvent;

    switch (type) {
      case "new_message": {
        const { message, thread: updatedThreadInfo } = payload;
        if (!message || !updatedThreadInfo) return;

        isInitialScroll.current = false; // New messages should trigger a smooth scroll
        setThreads((prev) => [
          updatedThreadInfo,
          ...prev.filter((t) => t._id !== updatedThreadInfo._id),
        ]);

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
                  router.push(`/messages?threadId=${message.threadId}`),
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
        setThreads((prev) =>
          prev.map((t) =>
            t._id === payload.threadId && t.lastMessage
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
  }, [lastEvent, session, router]);

  // FIX 2 & 3: Robust scrolling logic
  useEffect(() => {
    if (messagePanelRef.current) {
      const scrollContainer = messagePanelRef.current;
      const scrollBehavior = isInitialScroll.current ? "auto" : "smooth";

      // Use a timeout to ensure the DOM has updated before we try to scroll
      setTimeout(() => {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: scrollBehavior,
        });
        if (isInitialScroll.current) {
          isInitialScroll.current = false;
        }
      }, 0);
    }
  }, [messages]);

  useEffect(() => {
    if (editingMessage && editInputRef.current) {
      setEditedContent(editingMessage.content.text);
      editInputRef.current.focus();
    }
  }, [editingMessage]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThread || !session || !isConnected)
      return;

    isInitialScroll.current = false; // Sending a message should trigger a smooth scroll
    const tempId = Date.now().toString();
    const tempMessage = {
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
    };
    setMessages((prev) => [...prev, tempMessage]);

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
      threadId: selectedThread._id,
      senderId: session.user.id,
    });
    setEditingMessage(null);
  };

  const handleEditKeyDown = (e, msg) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit(msg._id, editedContent);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditingMessage(null);
    }
  };

  const filteredThreads = threads.filter((thread) => {
    const otherParticipant = thread.participants.find(
      (p) => p._id !== session?.user.id
    );
    return (
      !searchQuery ||
      otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (isLoading) return <MessagingSkeleton />;

  const currentOtherParticipant =
    selectedThread?.participants.find((p) => p._id !== session?.user.id) || {};
  const showMessagePanel = !isMobileView || (isMobileView && selectedThread);
  const showThreadPanel = !isMobileView || (isMobileView && !selectedThread);

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {showThreadPanel && (
        <aside className="w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-800 bg-slate-900 flex-shrink-0">
          <header className="p-4 border-b border-slate-800 flex-shrink-0">
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search or start new chat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </header>
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => {
                const otherParticipant =
                  thread.participants.find((p) => p._id !== session?.user.id) ||
                  {};
                const lastMessage = thread.lastMessage;
                const isUnread =
                  lastMessage?.sender?._id !== session?.user.id &&
                  !lastMessage?.recipient?.read;

                return (
                  <div
                    key={thread._id}
                    onClick={() => handleThreadSelect(thread)}
                    className={`p-3 border-b border-slate-800 cursor-pointer transition-colors duration-200 ${
                      selectedThread?._id === thread._id
                        ? "bg-indigo-600/20"
                        : "hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-indigo-300 font-bold text-lg relative overflow-hidden">
                          {otherParticipant.profilePhoto ? (
                            <Image
                              src={otherParticipant.profilePhoto}
                              alt={otherParticipant.name || "avatar"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            otherParticipant.name?.charAt(0).toUpperCase() ||
                            "?"
                          )}
                        </div>
                        {otherParticipant.online && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-white truncate">
                            {otherParticipant.name || "Unknown User"}
                          </h3>
                          {lastMessage && (
                            <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                              {formatDistanceToNow(
                                new Date(lastMessage.createdAt),
                                { addSuffix: true }
                              )}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm mt-1 truncate ${
                            isUnread
                              ? "text-slate-200 font-medium"
                              : "text-slate-400"
                          }`}
                        >
                          {lastMessage
                            ? (lastMessage.sender === session?.user.id
                                ? "You: "
                                : "") + lastMessage.content.text
                            : "No messages yet"}
                        </p>
                      </div>
                      {isUnread && (
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full flex-shrink-0 self-start mt-1"></div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-slate-400 text-sm">
                No conversations found.
              </div>
            )}
          </div>
        </aside>
      )}

      {showMessagePanel && (
        <main className="flex-1 flex flex-col h-full bg-slate-800/20">
          {selectedThread ? (
            <>
              <header className="p-3 border-b border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-900">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedThread(null);
                      router.push("/messages");
                    }}
                    className="md:hidden p-1 text-slate-400 hover:text-white"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-indigo-300 font-bold text-lg relative overflow-hidden">
                      {currentOtherParticipant.profilePhoto ? (
                        <Image
                          src={currentOtherParticipant.profilePhoto}
                          alt={currentOtherParticipant.name || "avatar"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        currentOtherParticipant.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    {currentOtherParticipant.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {currentOtherParticipant.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {currentOtherParticipant.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700">
                  <FiMoreVertical />
                </button>
              </header>

              <div
                ref={messagePanelRef}
                className="flex-1 overflow-y-auto p-4 space-y-2"
              >
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
                      {isUserMessage &&
                        !isEditing &&
                        msg.status !== "sending" && (
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
                          className={`max-w-xs md:max-w-md lg:max-w-xl px-4 py-2.5 rounded-2xl shadow-sm ${
                            isUserMessage
                              ? "bg-indigo-600 text-white rounded-br-lg"
                              : "bg-slate-700 text-slate-200 rounded-bl-lg"
                          }`}
                        >
                          {isEditing ? (
                            <div>
                              <textarea
                                ref={editInputRef}
                                value={editedContent}
                                onChange={(e) =>
                                  setEditedContent(e.target.value)
                                }
                                onKeyDown={(e) => handleEditKeyDown(e, msg)}
                                className="w-full bg-transparent text-white outline-none resize-none text-sm p-0"
                                rows={Math.max(
                                  1,
                                  editedContent.split("\n").length
                                )}
                              />
                              <p className="text-xs text-slate-300 mt-1">
                                escape to cancel • enter to save
                              </p>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap leading-relaxed">
                              {msg.content.text}
                            </p>
                          )}
                          <div
                            className={`text-xs mt-1.5 text-right ${
                              isUserMessage
                                ? "text-indigo-200"
                                : "text-slate-400"
                            }`}
                          >
                            {msg.status === "sending"
                              ? "sending..."
                              : format(new Date(msg.createdAt), "p")}
                            {msg.isEdited && (
                              <span className="ml-1 text-slate-400">
                                (edited)
                              </span>
                            )}
                          </div>
                        </div>
                        {msg.status === "sending" && isUserMessage && (
                          <FiLoader
                            className="animate-spin text-slate-400"
                            size={16}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <footer className="p-3 border-t border-slate-800 flex items-center gap-3 flex-shrink-0 bg-slate-900">
                <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700">
                  <FiPaperclip size={20} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-full bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 disabled:opacity-50"
                  disabled={!newMessage.trim() || !isConnected}
                >
                  <FiSend size={18} />
                </button>
              </footer>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center p-6">
                <FiMessageSquare className="mx-auto text-slate-700" size={64} />
                <h3 className="mt-4 text-xl font-medium text-white">
                  Your Messages
                </h3>
                <p className="mt-2 text-slate-400">
                  Select a conversation to start chatting.
                </p>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default function MessagePage() {
  return (
    <Suspense fallback={<MessagingSkeleton />}>
      <MessageContent />
    </Suspense>
  );
}
