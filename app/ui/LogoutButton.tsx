"use client";

import React from 'react';
import styles from '@/app/ui/footer.module.css';
import Image from 'next/image';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove('authToken');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <span className={styles.btn} onClick={handleLogout}>
      <Image width={32} height={32} src="/icons/windows-0.png" alt="windows95 logo" />
      Logout
    </span>
  );
};

export default LogoutButton;
