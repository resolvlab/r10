import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl active:scale-95";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg focus:ring-indigo-500",
    secondary: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500",
    outline: "border-2 border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600 focus:ring-indigo-500",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:ring-slate-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-6 py-4 text-lg font-semibold",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
