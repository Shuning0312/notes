// src/components/Header.tsx
import { Menu, Search } from "lucide-react";
import React, { useState } from "react";
import SearchModal from "./SearchModal";

interface NoteItem {
    type: "file" | "directory";
    name: string;
    title?: string;
    slug: string;
    path: string;
    children: NoteItem[];
    order?: number;
}
interface HeaderProps {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    notesStructure: NoteItem[]; // For search
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar, notesStructure }) => {
    const [searchModalOpen, setSearchModalOpen] = useState(false);

    return (
        <>
            <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center shrink-0">
                {/* Left part - Toggle Button */}
                <div className="flex-none ml-2"> {/* Adjusted margin for spacing */}
                    <button
                        onClick={toggleSidebar}
                        title="Toggle Sidebar"
                        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Middle part - Title, takes up available space and centers its text */}
                <div className="flex-1 text-center">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Boki's Blog
                    </h1>
                </div>

                {/* Right part - Search Button */}
                <div className="flex-none mr-2"> {/* Adjusted margin for spacing */}
                    <button
                        onClick={() => setSearchModalOpen(true)}
                        title="Search Notes"
                        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                        <Search size={24} />
                    </button>
                </div>
            </header>
            {searchModalOpen && (
                <SearchModal
                    isOpen={searchModalOpen}
                    onClose={() => setSearchModalOpen(false)}
                    notesStructure={notesStructure}
                />
            )}
        </>
    );
};

export default Header;

