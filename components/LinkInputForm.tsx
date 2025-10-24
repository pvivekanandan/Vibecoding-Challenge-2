
import React, { useState } from 'react';

interface LinkInputFormProps {
    onAddLink: (url: string) => void;
    isLoading: boolean;
}

export const LinkInputForm: React.FC<LinkInputFormProps> = ({ onAddLink, isLoading }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) {
            setError('Please enter a URL.');
            return;
        }
        try {
            // Basic URL validation
            new URL(url);
            setError('');
            onAddLink(url);
            setUrl('');
        } catch (_) {
            setError('Please enter a valid URL.');
        }
    };

    return (
        <div className="bg-surface p-6 rounded-lg shadow-md sticky top-[73px] z-40">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value)
                            if(error) setError('');
                        }}
                        placeholder="https://example.com/great-article"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-colors"
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full sm:w-auto flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-onPrimary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Stashing...
                        </>
                    ) : (
                        'Stash It!'
                    )}
                </button>
            </form>
            {error && <p className="text-danger text-sm mt-2">{error}</p>}
        </div>
    );
};
