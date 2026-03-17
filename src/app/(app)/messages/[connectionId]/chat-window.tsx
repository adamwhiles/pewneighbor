"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, cn } from "@/lib/utils";
import { ArrowLeft, Send, Calendar } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

interface ChatMember {
  profileId: string;
  displayName: string;
}

interface ChatWindowProps {
  connectionId: string;
  currentProfileId: string;
  chatTitle: string;
  initialMessages: Message[];
  members: ChatMember[];
}

export function ChatWindow({
  connectionId,
  currentProfileId,
  chatTitle,
  initialMessages,
  members,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showMeetupForm, setShowMeetupForm] = useState(false);
  const [meetupActivity, setMeetupActivity] = useState("");
  const [meetupDate, setMeetupDate] = useState("");
  const [meetupLocation, setMeetupLocation] = useState("");
  const [sendingMeetup, setSendingMeetup] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setInput("");

    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMsg: Message = {
      id: optimisticId,
      senderId: currentProfileId,
      content,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId, content }),
      });

      if (!res.ok) {
        // Remove optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        setInput(content);
        const data = await res.json();
        alert(data.error ?? "Failed to send message.");
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setInput(content);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }

  async function suggestMeetup() {
    setSendingMeetup(true);
    try {
      const res = await fetch("/api/messages/meetup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectionId,
          suggestedActivity: meetupActivity,
          suggestedDateRange: meetupDate,
          suggestedLocation: meetupLocation,
        }),
      });

      if (res.ok) {
        setShowMeetupForm(false);
        setMeetupActivity("");
        setMeetupDate("");
        setMeetupLocation("");
        // Add a local notice
        setMessages((prev) => [
          ...prev,
          {
            id: `meetup-${Date.now()}`,
            senderId: currentProfileId,
            content: `☕ Meetup suggestion sent: ${meetupActivity || "Get together"}${meetupDate ? ` — ${meetupDate}` : ""}${meetupLocation ? ` at ${meetupLocation}` : ""}`,
            createdAt: new Date(),
          },
        ]);
      }
    } finally {
      setSendingMeetup(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const getSenderName = (senderId: string) =>
    members.find((m) => m.profileId === senderId)?.displayName ?? "Unknown";

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border border-slate-200 bg-white shadow-sm md:h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
        <Link href="/messages" className="text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h2 className="font-semibold text-slate-900">{chatTitle}</h2>
          <p className="text-xs text-slate-500">Church connection</p>
        </div>
        <button
          onClick={() => setShowMeetupForm(!showMeetupForm)}
          className="flex items-center gap-1.5 rounded-lg bg-navy-50 px-3 py-1.5 text-sm font-medium text-navy-700 hover:bg-navy-100"
        >
          <Calendar className="h-4 w-4" />
          Suggest meetup
        </button>
      </div>

      {/* Meetup form */}
      {showMeetupForm && (
        <div className="border-b border-slate-200 bg-amber-50 p-4 space-y-3">
          <p className="text-sm font-medium text-amber-800">☕ Suggest a meetup</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <input
              placeholder="Activity (e.g. coffee, lunch, hike)"
              value={meetupActivity}
              onChange={(e) => setMeetupActivity(e.target.value)}
              className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <input
              placeholder="When (e.g. Saturday afternoon)"
              value={meetupDate}
              onChange={(e) => setMeetupDate(e.target.value)}
              className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <input
              placeholder="Where (optional)"
              value={meetupLocation}
              onChange={(e) => setMeetupLocation(e.target.value)}
              className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={suggestMeetup} loading={sendingMeetup} size="sm">
              Send suggestion
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowMeetupForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center text-slate-500">
            <div className="mb-3 text-3xl">👋</div>
            <p className="font-medium">You&apos;re connected!</p>
            <p className="text-sm mt-1">Say hello and start the conversation.</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId === currentProfileId;
          return (
            <div
              key={msg.id}
              className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}
            >
              {!isMe && (
                <span className="text-xs text-slate-400 px-1">
                  {getSenderName(msg.senderId)}
                </span>
              )}
              <div
                className={cn(
                  "max-w-xs rounded-2xl px-4 py-2 text-sm md:max-w-md",
                  isMe
                    ? "bg-navy-700 text-white rounded-br-sm"
                    : "bg-slate-100 text-slate-900 rounded-bl-sm"
                )}
              >
                {msg.content}
              </div>
              <span className="text-xs text-slate-400 px-1">
                {formatRelativeTime(new Date(msg.createdAt))}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-3 flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          rows={1}
          className="flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20 max-h-32"
          style={{ height: "auto" }}
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || sending}
          loading={sending}
          size="sm"
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
