import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'danger';
    children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
    const baseStyles = "px-6 py-2 rounded-xl font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-2";

    const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/20",
    outline: "border border-slate-700 text-slate-300 hover:bg-slate-800",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-red-900/20"
};

    return (
    <button 
    className={`${baseStyles} ${variants[variant]}`} 
    {...props} 
    >
    {children}
    </button>
);
};