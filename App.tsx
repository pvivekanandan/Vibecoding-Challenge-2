
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LinkInputForm } from './components/LinkInputForm';
import { LinkCard } from './components/LinkCard';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { fetchLinkMetadata } from './services/geminiService';
import { getLinks, saveLinks } from './services/mockApi';
import { type Link, type User } from './types';
import { Spinner } from './components/Spinner';

const AppContent: React.FC = () => {
    const { user } = useAuth();
    const [links, setLinks] = useState<Link[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUserLinks = useCallback(() => {
        if (user) {
            setIsLoading(true);
            getLinks(user.id)
                .then(userLinks => {
                    setLinks(userLinks);
                    setIsLoading(false);
                })
                .catch(() => {
                    setError('Failed to load your links.');
                    setIsLoading(false);
                });
        } else {
            setLinks([]);
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadUserLinks();
    }, [loadUserLinks]);

    const handleAddLink = async (url: string) => {
        if (!user) {
            setError("You must be logged in to add a link.");
            return;
        }

        if (links.some(link => link.url === url)) {
            setError("This link has already been stashed.");
            setTimeout(() => setError(null), 3000);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const metadata = await fetchLinkMetadata(url);
            const newLink: Link = {
                id: Date.now().toString(),
                url,
                ...metadata,
                createdAt: new Date().toISOString(),
            };
            const updatedLinks = [newLink, ...links];
            setLinks(updatedLinks);
            await saveLinks(user.id, updatedLinks);
        } catch (e) {
            console.error(e);
            setError("Failed to stash link. The URL might be invalid or inaccessible.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLink = async (id: string) => {
        if (!user) return;
        const updatedLinks = links.filter(link => link.id !== id);
        setLinks(updatedLinks);
        await saveLinks(user.id, updatedLinks);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                {user ? (
                    <>
                        <LinkInputForm onAddLink={handleAddLink} isLoading={isLoading} />
                        {error && (
                            <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg relative my-4" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        <div className="mt-8">
                            {isLoading && links.length === 0 ? (
                                <div className="flex justify-center items-center py-20">
                                    <Spinner />
                                    <p className="ml-4 text-lg text-gray-500">Loading your stash...</p>
                                </div>
                            ) : links.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {links.map(link => (
                                        <LinkCard key={link.id} link={link} onDelete={handleDeleteLink} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-surface rounded-lg shadow-sm">
                                    <h2 className="text-2xl font-semibold text-onSurface">Your Stash is Empty</h2>
                                    <p className="mt-2 text-gray-500">Add a link above to get started!</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-surface rounded-lg shadow-md">
                         <h1 className="text-4xl font-bold tracking-tight text-onSurface sm:text-5xl">Welcome to Stash</h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">Your personal link aggregator, powered by AI.</p>
                        <p className="mt-2 text-gray-600">Please sign in to start saving and summarizing links.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

const App: React.FC = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;
