"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { MoreVertical, ShieldAlert, Check, CheckCheck, Loader2, Image as ImageIcon } from "lucide-react";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
}

interface ChatRoomProps {
  chat: any;
  messages: Message[];
  currentUserId: string;
  isTyping: boolean;
  onSendMessage: (content: string, file: File | null) => Promise<void>;
  onMarkAsRead: () => void;
  onBlockUser: () => void;
  isBlocked: boolean;
}

export default function ChatRoom({ 
  chat, 
  messages, 
  currentUserId, 
  isTyping,
  onSendMessage,
  onMarkAsRead,
  onBlockUser,
  isBlocked
}: ChatRoomProps) {
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Mark unread messages from other user as read
    const hasUnread = messages.some(m => !m.is_read && m.sender_id !== currentUserId);
    if (hasUnread) {
      onMarkAsRead();
    }
  }, [messages, currentUserId, onMarkAsRead]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedFile) || isSending || isBlocked) return;

    setIsSending(true);
    try {
      await onSendMessage(inputText.trim(), selectedFile);
      setInputText("");
      setSelectedFile(null);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-ivory-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gold-300/30 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <img 
            src={chat.otherParticipant.images[0] || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.otherParticipant.name)}`}
            alt={chat.otherParticipant.name}
            className="w-10 h-10 rounded-full object-cover border border-gold-300/50"
          />
          <div>
            <h3 className="font-bold text-maroon-950 font-serif">{chat.otherParticipant.name}</h3>
            {isTyping && (
              <p className="text-xs text-gold-600 font-semibold italic animate-pulse">Typing...</p>
            )}
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
              <button 
                onClick={() => {
                  setShowMenu(false);
                  onBlockUser();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                {isBlocked ? 'Unblock User' : 'Block User'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
            <div className="w-16 h-16 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center mb-2 text-gold-400">
               ❈
            </div>
            <p className="text-sm font-serif">Start a conversation with {chat.otherParticipant.name}</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === currentUserId;
            const showDate = idx === 0 || new Date(msg.created_at).toDateString() !== new Date(messages[idx-1].created_at).toDateString();
            
            return (
              <div key={msg.id} className="space-y-4">
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-white/60 backdrop-blur-sm text-gray-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-gray-200/50">
                      {format(new Date(msg.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`max-w-[75%] rounded-2xl p-3 shadow-sm relative ${
                      isMe 
                        ? 'bg-gradient-to-br from-maroon-900 to-maroon-800 text-white rounded-tr-sm border border-maroon-700' 
                        : 'bg-white text-maroon-950 rounded-tl-sm border border-gold-300/30'
                    }`}
                  >
                    {msg.image_url && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-white/20">
                        <img src={msg.image_url} alt="Chat attachment" className="max-w-full max-h-64 object-cover" />
                      </div>
                    )}
                    {msg.content && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}
                    
                    <div className={`flex items-center gap-1 mt-1 justify-end ${isMe ? 'text-maroon-200' : 'text-gray-400'}`}>
                      <span className="text-[9px] font-medium">
                        {format(new Date(msg.created_at), 'hh:mm a')}
                      </span>
                      {isMe && (
                        <span className="ml-1">
                          {msg.is_read ? <CheckCheck className="w-3 h-3 text-gold-300" /> : <Check className="w-3 h-3 opacity-70" />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gold-300/30">
        {isBlocked ? (
          <div className="p-3 bg-red-50 text-red-600 text-center text-sm font-semibold rounded-xl border border-red-100">
            You cannot reply to this conversation.
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex flex-col gap-2">
            {selectedFile && (
              <div className="flex items-center justify-between bg-gold-50 p-2 rounded-xl border border-gold-200">
                <div className="flex items-center gap-2 text-xs text-maroon-900 font-semibold truncate">
                  <ImageIcon className="w-4 h-4 text-gold-600" />
                  {selectedFile.name}
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-500 hover:text-red-500 font-bold px-2 text-lg"
                >
                  &times;
                </button>
              </div>
            )}
            
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gold-600 bg-gold-50 hover:bg-gold-100 rounded-xl transition-colors shrink-0"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*" 
                className="hidden" 
              />
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 max-h-32 min-h-[44px] bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 resize-none transition-all"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              
              <button
                type="submit"
                disabled={(!inputText.trim() && !selectedFile) || isSending}
                className="px-5 py-3 bg-gradient-to-r from-maroon-900 to-maroon-800 text-white rounded-xl font-bold text-sm shadow-md hover:from-maroon-800 hover:to-maroon-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 flex items-center justify-center min-w-[80px]"
              >
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
