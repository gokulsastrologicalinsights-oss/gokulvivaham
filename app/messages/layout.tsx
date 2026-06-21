import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Messages - Gokul Vivaham",
  description: "Chat with your luxury matches securely.",
};

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen bg-ivory-100">
      <Navbar />
      <div className="h-20" /> {/* Spacer for sticky navbar */}
      
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:py-8 h-[calc(100vh-80px)]">
        <div className="bg-white rounded-3xl border border-gold-300/30 shadow-2xl overflow-hidden h-full flex flex-col md:flex-row relative">
          <div className="absolute inset-1.5 border border-gold-400/5 rounded-2xl pointer-events-none z-50 pointer-events-none" />
          {children}
        </div>
      </div>
    </main>
  );
}
