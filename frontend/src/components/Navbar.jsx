import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in by looking for access token in cookies
        const checkLoginStatus = () => {
            const accessToken = Cookies.get('access');
            setIsLoggedIn(!!accessToken);
        };
        
        checkLoginStatus();
        // Re-check login status when component mounts or when cookies might change
        window.addEventListener('storage', checkLoginStatus);
        return () => window.removeEventListener('storage', checkLoginStatus);
    }, []);

    const handleLogout = () => {
        // Remove access token and redirect to login page
        Cookies.remove('access');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div className="w-full">
            <div className="navbar bg-gradient-to-r from-primary to-secondary text-white shadow-lg w-full px-4 md:px-8">
                <div className="navbar-start w-1/3">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" onClick={() => setIsOpen(!isOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        {isOpen && (
                            <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-black">
                                <li><NavLink to="/posts" className={({isActive}) => isActive ? "active" : ""}>Posts</NavLink></li>
                            </ul>
                        )}
                    </div>
                    <a className="btn btn-ghost text-xl font-bold hover:bg-transparent">Blog</a>
                </div>
                <div className="navbar-center w-1/3 hidden lg:flex justify-center">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <NavLink 
                                to="/posts" 
                                className={({isActive}) => 
                                    `px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/20 ${isActive ? 'bg-white/20' : ''}`
                                }
                            >
                                Posts
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="navbar-end w-1/3 flex justify-end">
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="btn btn-ghost hover:bg-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            Logout
                        </button>
                    ) : (
                        <NavLink to="/login" className="btn btn-ghost hover:bg-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Login
                        </NavLink>
                    )}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                </div>
            </div>
        </div>
    )
}