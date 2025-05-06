// src/components/SearchModal.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';

// Define the structure type (adjust based on actual structure)
interface NoteItem {
    type: 'file' | 'directory';
    name: string;
    title?: string;
    slug: string;
    path: string;
    order?: number;
    children: NoteItem[];
}

interface SearchModalProps {
    notesStructure: NoteItem[];
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ notesStructure, isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<NoteItem[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Flatten the notes structure for easier searching
    const flattenStructure = (items: NoteItem[]): NoteItem[] => {
        let flatList: NoteItem[] = [];
        items.forEach(item => {
            if (item.type === 'file') {
                flatList.push(item);
            }
            if (item.children && item.children.length > 0) {
                flatList = flatList.concat(flattenStructure(item.children));
            }
        });
        return flatList;
    };

    const allNotes = flattenStructure(notesStructure);

    useEffect(() => {
        if (isOpen) {
            // Focus input when modal opens
            inputRef.current?.focus();
            // Reset search term
            setSearchTerm('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setResults([]);
            return;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredResults = allNotes.filter(note =>
            note.title?.toLowerCase().includes(lowerCaseSearchTerm) ||
            note.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            note.path.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setResults(filteredResults);

    }, [searchTerm, allNotes]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-start pt-20" 
            onClick={onClose} // Close on overlay click
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden" 
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                {/* Search Input */}
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700 p-3">
                    <Search size={18} className="text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button onClick={onClose} className="ml-2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>

                {/* Search Results */}
                <div className="max-h-80 overflow-y-auto p-3">
                    {searchTerm.trim() !== '' && results.length === 0 && (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No results found.</p>
                    )}
                    {results.map(note => (
                        <Link
                            key={note.slug}
                            href={`/notes/${note.slug}`}
                            onClick={onClose} // Close modal on link click
                            className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                            <span className="font-medium">{note.title || note.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">{note.path}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;

