"use client";

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '@/app/login/auth.module.css';
import Image from 'next/image';
import Link from 'next/link';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            Cookies.set('authToken', token, { expires: 7, secure: true, sameSite: 'strict' });
            router.push('/');
        } catch (error) {
            setError('Error logging in: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <div className="container">
                <div className="card">
                    <div className="card-header main-header">
                        <div className="sub-header">
                            <Image width={16} height={16} src="/icons/users_key-2.png" alt="users_key" />
                            <h4>Login</h4>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className={styles.container}>
                            {error && <p style={{ color: 'red' }}>Invalid email or password</p>}
                            <form className="form-container" onSubmit={handleLogin}>
                                <div className="form-item">
                                    <label className="form-label">Email</label>
                                    <input className="form-95 form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
                                </div>
                                <div className="form-item">
                                    <label className="form-label">Password</label>
                                    <input className="form-95 form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" />
                                </div>
                                <div className={styles.signup}>
                                <Link href="/register"><p>Not registered yet? Sign up here.</p></Link>
                                </div>
                                <div className="form-button-item">
                                    <button type="submit" className="standard-button"> {loading ? 'Logging in...' : 'Login'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
