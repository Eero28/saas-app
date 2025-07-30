"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js"
import { createClient } from "@/lib/client";


interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
}
interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [session, setSession] = useState<Session | null>(null)

    const supabase = createClient()

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);

            if (data.session?.user) {
                setUser(data.session.user);
            } else {
                setUser(null);
            }

            setLoading(false);
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("Auth state changed:", _event);

            setSession(session);
            setUser(session?.user ?? null);
        });

        getSession();

        // clean up
        return () => {
            subscription.unsubscribe();
        };
    }, []);


    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const value = { user, loading, session, signOut };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used withing an Authprovider")
    }
    return context
}

export default AuthProvider;