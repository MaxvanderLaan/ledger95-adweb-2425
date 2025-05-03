'use client'

import styles from '@/app/dashboard/dashboard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from "react";
import { db } from '@/firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from '@/context/AuthContext';

export default function Page() {
    const { user } = useAuth();

    return (
        <main>
            <p>page.tsx</p>
        </main>
    );
}
