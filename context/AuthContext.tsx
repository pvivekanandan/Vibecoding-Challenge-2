
import React, { createContext, useState, useEffect } from 'react';
import { type User } from '../types';
import { MOCK_signIn, MOCK_signUp, MOCK_signOut, MOCK_getCurrentUser } from '../services/mockApi';

interface AuthContextType {
    user: User | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string) => Promise<void>;
    signOut: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await MOCK_getCurrentUser();
                setUser(currentUser);
            } catch (e) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const signIn = async (email: string, pass: string) => {
        const loggedInUser = await MOCK_signIn(email, pass);
        setUser(loggedInUser);
    };

    const signUp = async (email: string, pass: string) => {
        const newUser = await MOCK_signUp(email, pass);
        setUser(newUser);
    };

    const signOut = () => {
        MOCK_signOut();
        setUser(null);
    };

    const value = { user, signIn, signUp, signOut, loading };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
