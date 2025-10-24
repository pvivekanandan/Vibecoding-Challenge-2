
import React from 'react';
import { type Link } from '../types';
import { Tag } from './Tag';

interface LinkCardProps {
    link: Link;
    onDelete: (id: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete }) => {
    const { title, summary, url, tags, id } = link;
    const domain = new URL(url).hostname;

    return (
        <div className="bg-surface rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-shadow hover:shadow-xl">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                        <h3 className="text-xl font-bold text-onSurface hover:text-primary transition-colors">{title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{domain}</p>
                    </a>
                    <button onClick={() => onDelete(id)} className="text-gray-400 hover:text-danger transition-colors p-1 ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <p className="text-gray-600 mt-4 text-base">{summary}</p>
            </div>
            <div className="bg-background px-6 py-4">
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <Tag key={tag} text={tag} />
                    ))}
                </div>
            </div>
        </div>
    );
};
