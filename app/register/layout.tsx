import React from 'react';

interface RegisterLayoutProps {
    children: React.ReactNode;
}

const RegisterLayout: React.FC<RegisterLayoutProps> = ({ children }) => {
    return (
        <div>
            <h1>Register Layout</h1>
            <main>{children}</main>
        </div>
    );
};

export default RegisterLayout;
