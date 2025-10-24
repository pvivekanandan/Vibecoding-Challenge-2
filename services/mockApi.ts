
import { type User, type Link } from '../types';

// --- MOCK DATABASE (using localStorage) ---
const USERS_KEY = 'stash_users';
const LINKS_KEY_PREFIX = 'stash_links_';
const SESSION_KEY = 'stash_session';

// Helper to get users from localStorage
const getUsers = (): Record<string, Omit<User, 'id'> & { passwordHash: string }> => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : {};
};

// Helper to save users to localStorage
const saveUsers = (users: Record<string, Omit<User, 'id'> & { passwordHash: string }>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};


// --- MOCK AUTHENTICATION SERVICE ---

export const MOCK_signUp = (email: string, pass: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            if (users[email]) {
                return reject(new Error('User with this email already exists.'));
            }
            const newUser: User = { id: `user_${Date.now()}`, email };
            users[email] = { email, passwordHash: `hashed_${pass}` }; // Simple mock hash
            saveUsers(users);
            localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
            resolve(newUser);
        }, 500);
    });
};

export const MOCK_signIn = (email: string, pass: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            const userData = users[email];
            if (!userData || userData.passwordHash !== `hashed_${pass}`) {
                return reject(new Error('Invalid email or password.'));
            }
            const user: User = { id: `user_${Object.keys(users).indexOf(email)}`, email }; // Reconstruct ID for demo
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
            resolve(user);
        }, 500);
    });
};

export const MOCK_signOut = (): void => {
    localStorage.removeItem(SESSION_KEY);
};

export const MOCK_getCurrentUser = (): Promise<User | null> => {
     return new Promise((resolve) => {
        setTimeout(() => {
            const sessionJson = localStorage.getItem(SESSION_KEY);
            resolve(sessionJson ? JSON.parse(sessionJson) : null);
        }, 200);
     });
};


// --- MOCK DATABASE SERVICE ---

export const getLinks = (userId: string): Promise<Link[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const linksJson = localStorage.getItem(`${LINKS_KEY_PREFIX}${userId}`);
            resolve(linksJson ? JSON.parse(linksJson) : []);
        }, 500);
    });
};

export const saveLinks = (userId: string, links: Link[]): Promise<void> => {
     return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.setItem(`${LINKS_KEY_PREFIX}${userId}`, JSON.stringify(links));
            resolve();
        }, 200);
    });
};
