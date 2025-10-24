
export interface User {
    id: string;
    email: string;
}

export interface Link {
    id: string;
    url: string;
    title: string;
    summary: string;
    tags: string[];
    createdAt: string;
}
