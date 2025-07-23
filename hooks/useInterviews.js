"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export function useInterviews() {
  const { data: session } = useSession();
  const { threadId } = useParams(); // Get threadId from URL
  const router = useRouter();

  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const pollingRef = useRef(null);

  // 1. Fetch all threads on component mount
  useEffect(() => {
    if (!session) return;
    const fetchThreads = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/threads");
        if (!response.ok) throw new Error("Failed to load conversations.");
        const data = await response.json();
        setThreads(data);

        // If a threadId is in the URL, find and select it
        if (threadId) {
          const targetThread = data.find((t) => t._id === threadId);
          if (targetThread) {
            setSelectedThread(targetThread);
          } else {
            toast.error("Conversation not found.");
            router.replace("/dashboard/brand-owner/messages");
          }
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchThreads();
  }, [session, threadId, router]);

  // 2. Fetch messages and start polling when a thread is selected
  useEffect(() => {
    // Clear any existing polling interval
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    if (!selectedThread) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/threads/${selectedThread._id}/messages`
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages(); // Initial fetch

    // Start polling for new messages every 5 seconds
    pollingRef.current = setInterval(fetchMessages, 5000);

    // Cleanup function to stop polling when component unmounts or thread changes
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [selectedThread]);

  // 3. Handle sending a new message
  const handleSendMessage = async (newMessageContent) => {
    if (!newMessageContent.trim() || !selectedThread || !session) return;

    // Optimistically update the UI
    const tempMessage = {
      _id: Date.now().toString(),
      sender: {
        _id: session.user.id,
        name: session.user.name,
        image: session.user.image,
      },
      content: { text: newMessageContent },
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const response = await fetch(
        `/api/threads/${selectedThread._id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newMessageContent, type: "text" }),
        }
      );

      const sentMessage = await response.json();
      if (!response.ok)
        throw new Error(sentMessage.error || "Failed to send message");

      // Replace temp message with the real one from the server
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempMessage._id ? sentMessage : msg))
      );

      // Update the thread in the list to move it to the top
      setThreads((prev) =>
        prev
          .map((t) =>
            t._id === selectedThread._id
              ? {
                  ...t,
                  lastMessage: sentMessage,
                  updatedAt: sentMessage.createdAt,
                }
              : t
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
    } catch (error) {
      toast.error(error.message);
      // Rollback on failure
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
    }
  };

  const selectThread = (thread) => {
    // Update URL without a full page reload for better UX
    router.push(`/dashboard/brand-owner/messages/${thread._id}`, {
      scroll: false,
    });
    setSelectedThread(thread);
  };

  return {
    threads,
    selectedThread,
    messages,
    isLoading,
    currentUser: session?.user,
    handleSendMessage,
    selectThread,
  };
}
