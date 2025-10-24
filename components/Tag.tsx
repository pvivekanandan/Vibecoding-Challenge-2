
import React from 'react';

interface TagProps {
    text: string;
}

export const Tag: React.FC<TagProps> = ({ text }) => {
    return (
        <span className="inline-block bg-secondary/10 text-secondary text-xs font-medium px-2.5 py-1 rounded-full">
            {text}
        </span>
    );
};
