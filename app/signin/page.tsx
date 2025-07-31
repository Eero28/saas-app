"use client";

import { useState } from "react";
import "../../styling/signin.css";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";

const SigninPage = () => {
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const supabase = createClient();

    const router = useRouter();

    const handleAuth = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage("");
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });

                if (error) throw error;

                setMessage("Check your email for confirmation link!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                router.push("/dashboard");
            }
        } catch (e: any) {
            console.error(e);
            setMessage(e.message || "Something went wrong.");
        }
    };

    return (
        <div className="signin-container">
            <div className="form-wrapper">
                <div className="header">
                    <h1>App</h1>
                    <p>
                        {isSignUp ? "Create your account!" : "Sign in to your account!"}
                    </p>
                    <p>{message}</p>
                </div>

                <form onSubmit={handleAuth}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            name="email"
                            type="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            name="password"
                            type="password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="primary-btn">
                            {isSignUp ? "Sign up" : "Sign in"}
                        </button>
                    </div>

                    <div className="form-group text-center">
                        <button
                            type="button"
                            className="link-btn"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp
                                ? "Already have an account? Sign in!"
                                : "Don't have an account? Sign up!"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SigninPage;
