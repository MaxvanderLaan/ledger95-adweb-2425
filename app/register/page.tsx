"use client";

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useRouter } from 'next/navigation';
import styles from '@/app/login/auth.module.css';
import Image from 'next/image';
import Link from 'next/link';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      router.push('/login');
    } catch (error) {
      setError('Error registering: ' + (error as Error).message);
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
              <h4>Register</h4>
            </div>
          </div>
          <div className="card-body">
            <div className={styles.container}>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <form className="form-container" onSubmit={handleRegister}>
                <div className="form-item">
                  <label className="form-label">Email</label>
                  <input className="form-95 form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
                </div>
                <div className="form-item">
                  <label className="form-label">Password</label>
                  <input className="form-95 form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" />
                </div>
                <div className={styles.signup}>
                  <Link href="/login"><p>Return to login.</p></Link>
                </div>
                <div className="form-button-item">
                  <button type="submit" className="standard-button">{loading ? 'Registering...' : 'Register'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
