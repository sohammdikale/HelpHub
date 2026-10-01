"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { MessageSquare, Send, User, Shield, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function WorkerChatPage() {
  const { currentUser, conversations, messages, sendMessage } = useStore();

  const myConversations = conversations.filter(
    (c) => c.workerId === currentUser?.id || c.employerId === currentUser?.id
  );

  const [activeConvId, setActiveConvId] = useState<string>(
    myConversations[0]?.id || ""
  );
  const [inputText, setInputText] = useState("");

  if (!currentUser) {
    return <div className="p-8 text-center text-xs text-slate-500">Please sign in to view messages.</div>;
  }

  const activeConversation = myConversations.find((c) => c.id === activeConvId);
  const conversationMessages = messages.filter((m) => m.conversationId === activeConvId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;
    sendMessage(activeConvId, inputText);
    setInputText("");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-600" />
            <h1 className="text-lg font-bold text-slate-900">In-App Task Messaging</h1>
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            Private phone numbers protected
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card grid grid-cols-1 md:grid-cols-12 overflow-hidden h-[600px]">
          {/* Conversation List Sidebar */}
          <div className="md:col-span-4 border-r border-slate-100 flex flex-col h-full bg-slate-50/50">
            <div className="p-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Discussions ({myConversations.length})
              </span>
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              {myConversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No active conversations. Chats open automatically when you are assigned or shortlisted for a task.
                </div>
              ) : (
                myConversations.map((c) => {
                  const isSelected = c.id === activeConvId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveConvId(c.id)}
                      className={`w-full p-4 text-left transition-colors flex flex-col gap-1 ${
                        isSelected ? "bg-white border-l-4 border-teal-600 shadow-sm" : "hover:bg-slate-100/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {c.employerName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.lastMessageTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-teal-700 truncate">
                        {c.jobTitle}
                      </span>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {c.lastMessage}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Chat Thread */}
          <div className="md:col-span-8 flex flex-col h-full bg-white">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-950 text-white flex items-center justify-center font-bold text-xs">
                      {activeConversation.employerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {activeConversation.employerName}
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        Task: <strong>{activeConversation.jobTitle}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {conversationMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-md p-3 rounded-2xl text-xs ${
                            isMe
                              ? "bg-teal-600 text-white rounded-br-none"
                              : "bg-slate-100 text-slate-800 rounded-bl-none"
                          }`}
                        >
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={handleSend}
                  className="p-3 border-t border-slate-100 flex items-center gap-2 bg-slate-50/60"
                >
                  <input
                    type="text"
                    placeholder="Type task details or ask a question..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <Button type="submit" variant="accent" size="sm">
                    <Send className="w-3.5 h-3.5 mr-1" />
                    Send
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-slate-400">
                Select a conversation from the sidebar to start messaging.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
