'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode, createContext, useContext } from 'react';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

const GoogleAuthAvailableContext = createContext<boolean>(false);

export function useGoogleAuthAvailable() {
    return useContext(GoogleAuthAvailableContext);
}

export function GoogleAuthProvider({ children }: { children: ReactNode }) {
    if (!GOOGLE_CLIENT_ID) {
        console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google login will be disabled.');
        return (
            <GoogleAuthAvailableContext.Provider value={false}>
                {children}
            </GoogleAuthAvailableContext.Provider>
        );
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleAuthAvailableContext.Provider value={true}>
                {children}
            </GoogleAuthAvailableContext.Provider>
        </GoogleOAuthProvider>
    );
}
