import React, { Suspense } from 'react';
import LoginForm from './loginForm';

const LoginPage: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading login form...</div>}>
            <LoginForm />
        </Suspense>
    );
};

export default LoginPage;