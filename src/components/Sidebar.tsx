// src/components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";

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

interface SidebarProps {
    notesStructure: NoteItem[];
    currentSlug: string; 
}

const Sidebar: React.FC<SidebarProps> = ({ notesStructure, currentSlug }) => {
    const renderNotes = (notes: NoteItem[], level = 0) => {
        return (
            <ul className={level > 0 ? "ml-4" : ""}>
                {notes.map((note) => {
                    const isActive = currentSlug === note.slug;
                    const commonClasses = `block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150`;
                    const activeClasses = "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100";
                    const inactiveClasses = "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700";
                    const nonClickableClasses = "text-gray-500 dark:text-gray-400 cursor-default"; // Styles for non-clickable directories

                    let nodeContent;
                    if (note.isClickable) {
                        const href = `/notes/${note.slug.split("/").map(segment => encodeURIComponent(segment)).join("/")}`;
                        nodeContent = (
                            <Link
                                href={href}
                                className={`${commonClasses} ${isActive ? activeClasses : inactiveClasses}`}
                            >
                                {note.title || note.name}
                            </Link>
                        );
                    } else {
                        // Non-clickable directory: render as plain text
                        nodeContent = (
                            <span className={`${commonClasses} ${nonClickableClasses}`}>
                                {note.title || note.name}
                            </span>
                        );
                    }

                    return (
                        <li key={note.slug} className="my-1">
                            {nodeContent}
                            {note.children && note.children.length > 0 && (
                                <div className="mt-1">
                                    {renderNotes(note.children, level + 1)}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };

    return <nav className="h-full">{renderNotes(notesStructure)}</nav>;
};

export default Sidebar;

