import React from 'react';

interface LoginLayoutProps {
    children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
    return (
        <div>
            <h1>Login Layout</h1>
            <main>{children}</main>
        </div>
    );
};

export default LoginLayout;
