"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Menu, X } from "lucide-react"; 

interface NoteItem {
    type: "file" | "directory";
    name: string;
    title?: string;
    slug: string;
    path: string;
    children: NoteItem[];
    order?: number;
    isClickable?: boolean; // Added to determine if a directory is clickable
}

interface RootLayoutInternalProps {
  children: React.ReactNode;
  notesStructure: NoteItem[]; 
}

export default function RootLayoutInternal({ children, notesStructure }: RootLayoutInternalProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const pathname = usePathname();

  const currentSlug = pathname.startsWith("/notes/")
    ? pathname.substring("/notes/".length).split("/").map(decodeURIComponent).join("/")
    : "";

  const sidebarWidthClass = "w-64"; 

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 ${sidebarWidthClass} overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out transform ${ 
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:block ${isSidebarOpen ? "lg:block" : "lg:hidden"}`}
      >
        {isSidebarOpen && (
            <div className="p-4">
              <Sidebar notesStructure={notesStructure} currentSlug={currentSlug} />
            </div>
        )}
      </aside>

      {/* Main Content Area Wrapper */}
      <div 
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${ 
          isSidebarOpen ? "lg:ml-0" : "ml-0" 
          // When sidebar is static (lg screens) and hidden, main content should take full width.
          // When sidebar is overlay (smaller screens) and hidden, main content is already full width.
          // The lg:ml-64 was removed as the sidebar is now either present or hidden using lg:block/lg:hidden
        }`}
      >
        {/* Header */}
        <header 
          className={`sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm`}
        >
           <Header 
             toggleSidebar={toggleSidebar} 
             isSidebarOpen={isSidebarOpen} 
             notesStructure={notesStructure} 
           />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

