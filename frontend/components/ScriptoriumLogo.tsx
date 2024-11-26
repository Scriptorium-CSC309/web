import React from 'react';
import Logo from "@/frontend/assets/images/scriptorium-logo.svg";

interface ScriptoriumLogoProps {
    size?: number;  // Size in rem
}

const ScriptoriumLogo: React.FC<ScriptoriumLogoProps> = ({ 
    size = 4
}) => {
    
    return (
        <div 
            className={`rounded-full flex items-center justify-center bg-brand-orange`}
            style={{ 
                width: `${size}rem`,
                height: `${size}rem`
            }}
        >
            <Logo 
                alt="Scriptorium Logo" 
                width={size}
                height={size}
                className="w-full h-full"
                style={{
                    maxWidth: '100%',
                    height: 'auto'
                }}
            />
        </div>
    );
};

export default ScriptoriumLogo;