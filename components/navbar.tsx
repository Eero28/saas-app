"use client";
import { useState } from "react";
import "../styling/navbar.css";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
    const { user, signOut } = useAuth()

    const router = useRouter()
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await signOut();
            router.push("/signin");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (!user) {
        return null;
    }
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <span className="navbar-logo">Welcome, {user.email}</span>
                <ul className="navbar-links">
                    {pathname !== "/profile" && (
                        <li>
                            <a href="/profile">Profile</a>
                        </li>
                    )}
                    <li>
                        {user ? (
                            <button onClick={handleLogout} className="auth-btn">
                                Logout
                            </button>
                        ) : (
                            <button onClick={() => router.push("/signin")} className="auth-btn">
                                Sign In
                            </button>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}
