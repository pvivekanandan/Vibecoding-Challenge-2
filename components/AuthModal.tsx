
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export type AuthMode = 'signin' | 'signup';

interface AuthModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    initialMode: AuthMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, setIsOpen, initialMode }) => {
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signIn, signUp } = useAuth();

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);
    
    useEffect(() => {
        if (isOpen) {
            setError('');
            setEmail('');
            setPassword('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (mode === 'signin') {
                await signIn(email, password);
            } else {
                await signUp(email, password);
            }
            setIsOpen(false);
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        }
    };

    const toggleMode = () => {
        setMode(mode === 'signin' ? 'signup' : 'signin');
        setError('');
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center" id="my-modal">
            <div className="relative mx-auto p-8 border w-full max-w-md shadow-lg rounded-md bg-surface">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">{mode === 'signin' ? 'Sign In' : 'Create Account'}</h3>
                    <div className="mt-4">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <p className="text-red-500 text-sm bg-red-100 p-3 rounded-md">{error}</p>}
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                             <div>
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                    {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                                </button>
                            </div>
                        </form>
                        <p className="mt-6 text-center text-sm text-gray-500">
                            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                            <button onClick={toggleMode} className="font-medium text-primary hover:text-primary/80">
                                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
