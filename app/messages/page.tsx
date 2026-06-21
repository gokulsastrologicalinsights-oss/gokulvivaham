"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ChatList from "@/components/chat/ChatList";
import ChatRoom from "@/components/chat/ChatRoom";
import { getChats, getMessages, sendMessage, markMessagesAsRead, uploadChatImage, blockChat, unblockChat } from "@/lib/api";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

export default function MessagesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isTypingMap, setIsTypingMap] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Realtime channels
  const chatChannelRef = useRef<RealtimeChannel | null>(null);
  const presenceChannelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCurrentUser(data.user);
        loadChats(data.user.id);
      } else {
        router.push("/login");
      }
    });

    return () => {
      chatChannelRef.current?.unsubscribe();
      presenceChannelRef.current?.unsubscribe();
    };
  }, [supabase, router]);

  const loadChats = async (userId: string) => {
    setIsLoading(true);
    const chatsData = await getChats(userId);
    setChats(chatsData);
    setIsLoading(false);
    
    // Setup presence
    setupPresence(userId);
  };

  const setupPresence = (userId: string) => {
    if (presenceChannelRef.current) return;

    const channel = supabase.channel('online_users', {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel.on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState();
      const onlineIds = Object.keys(presenceState);
      setOnlineUsers(onlineIds);
    }).subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ online_at: new Date().toISOString() });
      }
    });

    presenceChannelRef.current = channel;
  };

  const setupChatRealtime = (chatId: string) => {
    if (chatChannelRef.current) {
      chatChannelRef.current.unsubscribe();
    }

    const channel = supabase.channel(`chat_${chatId}`);

    // Listen for new messages
    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
      (payload) => {
        setMessages((prev) => {
          if (!prev.find(m => m.id === payload.new.id)) {
             return [...prev, payload.new];
          }
          return prev;
        });
        
        // Update chat list latest message and read status
        setChats((prev) => prev.map(c => {
          if (c.id === chatId) {
            const isMe = payload.new.sender_id === currentUser?.id;
            return {
              ...c,
              latestMessage: payload.new,
              unreadCount: isMe ? c.unreadCount : (c.id === currentChatId ? 0 : c.unreadCount + 1)
            };
          }
          return c;
        }).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      }
    );

    // Listen for message read updates
    channel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
      (payload) => {
        setMessages((prev) => prev.map(m => m.id === payload.new.id ? payload.new : m));
      }
    );

    // Listen for typing broadcasts
    channel.on(
      'broadcast',
      { event: 'typing' },
      (payload) => {
        if (payload.payload.user_id !== currentUser?.id) {
          setIsTypingMap(prev => ({ ...prev, [chatId]: payload.payload.is_typing }));
        }
      }
    );

    channel.subscribe();
    chatChannelRef.current = channel;
  };

  const handleSelectChat = async (chatId: string) => {
    setCurrentChatId(chatId);
    setMessages([]);
    
    // Mark as read immediately in local state
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
    
    const msgs = await getMessages(chatId);
    setMessages(msgs);
    setupChatRealtime(chatId);
    
    if (currentUser) {
      await markMessagesAsRead(chatId, currentUser.id);
    }
  };

  const handleSendMessage = async (content: string, file: File | null) => {
    if (!currentChatId || !currentUser) return;

    let imageUrl = null;
    if (file) {
      imageUrl = await uploadChatImage(currentChatId, file);
    }

    // Stop typing indicator when sending
    handleTyping(false);
    
    await sendMessage(currentChatId, currentUser.id, content, imageUrl);
  };

  const handleTyping = (isTyping: boolean) => {
    if (chatChannelRef.current && currentChatId && currentUser) {
      chatChannelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: currentUser.id, is_typing: isTyping },
      });
    }
  };

  const handleBlockUser = async () => {
    if (!currentChatId || !currentUser) return;
    const chat = chats.find(c => c.id === currentChatId);
    if (!chat) return;

    const isBlocked = chat.status === 'blocked';
    
    if (isBlocked && chat.blocked_by_id === currentUser.id) {
       await unblockChat(currentChatId);
       setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, status: 'active', blocked_by_id: null } : c));
    } else if (!isBlocked) {
       await blockChat(currentChatId, currentUser.id);
       setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, status: 'blocked', blocked_by_id: currentUser.id } : c));
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    );
  }

  const currentChat = chats.find(c => c.id === currentChatId);
  const isBlocked = currentChat?.status === 'blocked';

  return (
    <>
      <div className={`md:w-80 w-full flex-shrink-0 ${currentChatId ? 'hidden md:block' : 'block'}`}>
        <ChatList 
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onlineUsers={onlineUsers}
        />
      </div>
      
      <div className={`flex-1 min-w-0 flex flex-col ${!currentChatId ? 'hidden md:flex' : 'flex'}`}>
        {currentChatId && currentChat ? (
          <>
            <div className="md:hidden p-3 bg-white border-b border-gold-300/30 flex items-center shadow-sm">
              <button 
                onClick={() => setCurrentChatId(null)}
                className="text-gold-700 font-bold flex items-center text-sm"
              >
                &larr; Back to messages
              </button>
            </div>
            
            <div className="flex-1 relative" 
                 onKeyDown={(e) => {
                   // Simple debounced typing indicator logic
                   if (!['Enter', 'Shift', 'Control', 'Alt'].includes(e.key)) {
                     handleTyping(true);
                     setTimeout(() => handleTyping(false), 3000);
                   }
                 }}>
              <ChatRoom 
                chat={currentChat}
                messages={messages}
                currentUserId={currentUser?.id}
                isTyping={!!isTypingMap[currentChatId]}
                onSendMessage={handleSendMessage}
                onMarkAsRead={() => currentUser && markMessagesAsRead(currentChatId, currentUser.id)}
                onBlockUser={handleBlockUser}
                isBlocked={isBlocked}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-ivory-50 text-gray-400 p-8 text-center relative">
            <div className="w-32 h-32 bg-gold-400/5 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border border-gold-200 mb-6 relative z-10 text-gold-500 text-4xl">
              ❈
            </div>
            <h3 className="text-2xl font-bold text-maroon-900 font-serif mb-2 relative z-10">Luxury Messages</h3>
            <p className="max-w-xs relative z-10 font-medium">Select a conversation from the list to continue connecting with your premium matches.</p>
          </div>
        )}
      </div>
    </>
  );
}
