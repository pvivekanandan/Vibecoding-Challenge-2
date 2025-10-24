
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './AuthModal';
import { type AuthMode } from './AuthModal';

export const Header: React.FC = () => {
    const { user, signOut } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<AuthMode>('signin');

    const openModal = (mode: AuthMode) => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    return (
        <header className="bg-surface shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h14a1 1 0 011 1v4.293zM5 6a1 1 0 100 2 1 1 0 000-2zm3 0a1 1 0 100 2 1 1 0 000-2zm3 0a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                    </svg>
                    <h1 className="text-2xl font-bold text-onSurface">Stash</h1>
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="text-gray-600 hidden sm:block">{user.email}</span>
                            <button
                                onClick={signOut}
                                className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 border border-transparent rounded-md hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => openModal('signin')}
                                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 focus:outline-none"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => openModal('signup')}
                                className="px-4 py-2 text-sm font-medium text-onPrimary bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
            <AuthModal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen} initialMode={authMode} />
        </header>
    );
};
