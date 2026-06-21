"use client";

import { useState } from "react";
import { Profile } from "@/lib/data";
import { formatDistanceToNow } from "date-fns";
import { Search } from "lucide-react";

interface ChatListProps {
  chats: any[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onlineUsers: string[];
}

export default function ChatList({ chats, currentChatId, onSelectChat, onlineUsers }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter(chat => 
    chat.otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-gold-300/30">
      <div className="p-4 border-b border-gold-300/30">
        <h2 className="text-xl font-bold text-maroon-900 font-serif mb-4">Messages</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-ivory-50 border border-gold-300/40 rounded-xl text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            No conversations found.
          </div>
        ) : (
          <ul className="divide-y divide-gold-300/10">
            {filteredChats.map((chat) => {
              const isOnline = onlineUsers.includes(chat.otherParticipant.id);
              const isSelected = currentChatId === chat.id;
              
              return (
                <li 
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`p-4 cursor-pointer hover:bg-gold-50/30 transition-colors flex items-center gap-3 ${isSelected ? 'bg-gold-50/50 border-l-4 border-l-gold-500' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={chat.otherParticipant.images[0] || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.otherParticipant.name)}`}
                      alt={chat.otherParticipant.name}
                      className="w-12 h-12 rounded-full object-cover border border-gold-300/50"
                    />
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-maroon-950 text-sm truncate">
                        {chat.otherParticipant.name}
                      </h3>
                      {chat.latestMessage && (
                        <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                          {formatDistanceToNow(new Date(chat.latestMessage.created_at), { addSuffix: true }).replace('about ', '')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-maroon-900 font-bold' : 'text-gray-500'}`}>
                        {chat.latestMessage 
                          ? (chat.latestMessage.sender_id === chat.otherParticipant.id ? '' : 'You: ') + 
                            (chat.latestMessage.image_url ? '📷 Image' : chat.latestMessage.content) 
                          : 'No messages yet'}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-maroon-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center ml-2 flex-shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
