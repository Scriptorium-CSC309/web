import React, { useContext, useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { StateContext as UserStateContext } from "../contexts/UserContext";
import ScriptoriumLogo from "./ScriptoriumLogo";
import HamburgerMenu from "./HamburgerMenu";
import Avatar from "@/frontend/components/Avatar";
import { clearTokens } from "@/frontend/utils/token-storage";
import { DispatchContext as UserDispatchContext } from "@/frontend/contexts/UserContext";

type NavbarProps = {
    onHeightChange?: (height: number) => void; // Callback to notify parent of height
};

const Navbar: React.FC<NavbarProps> = ({ onHeightChange }) => {
    const user = useContext(UserStateContext);
    const navbarRef = useRef<HTMLDivElement>(null);
    const dispatch = useContext(UserDispatchContext);

    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (navbarRef.current) {
            const height = navbarRef.current.offsetHeight;
            onHeightChange?.(height); // Notify parent of height change
        }
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setIsDropdownOpen(false);

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        clearTokens();
    };

    return (
        <nav
            ref={navbarRef}
            className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <ScriptoriumLogo size={2.2} />
                            <span className="ml-2 text-lg font-bold text-gray-900 dark:text-gray-200">
                                Scriptorium
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex space-x-8">
                        <Link
                            href="/code"
                            className="text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                        >
                            Code
                        </Link>
                        <Link
                            href="/blogposts"
                            className="text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                        >
                            Discussions
                        </Link>
                        <Link
                            href="/code-templates"
                            className="text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                        >
                            Templates
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        {mounted && (
                            <button
                                onClick={() =>
                                    setTheme(
                                        resolvedTheme === "light"
                                            ? "dark"
                                            : "light"
                                    )
                                }
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Toggle Theme"
                            >
                                {resolvedTheme === "light" ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-900"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="5" />
                                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-200"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 0010.5 9.79z" />
                                    </svg>
                                )}
                            </button>
                        )}

                        {/* User Profile or Login/Signup */}
                        <div className="hidden sm:flex items-center space-x-4">
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="focus:outline-none"
                                    >
                                        <Avatar
                                            avatarId={user.avatarId}
                                            width={36}
                                            height={36}
                                            className="rounded-full"
                                        />
                                    </button>
                                    {isDropdownOpen && (
                                        <div
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1"
                                            onMouseLeave={closeDropdown}
                                        >
                                            <Link
                                                href="/user/profile"
                                                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Hamburger Menu */}
                        <div className="sm:hidden">
                            <button
                                onClick={toggleMenu}
                                className="text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                            >
                                <HamburgerMenu isMenuOpen={isMenuOpen} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="sm:hidden px-4 pt-2 pb-4 space-y-2 bg-white dark:bg-gray-900">
                    <Link
                        href="/code"
                        className="block text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                    >
                        Code
                    </Link>
                    <Link
                        href="/discussions"
                        className="block text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                    >
                        Discussions
                    </Link>
                    <Link
                        href="/code-templates"
                        className="block text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                    >
                        Templates
                    </Link>
                    {user ? (
                        <>
                            <Link
                                href="/user/profile"
                                className="block text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="block text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="block px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 text-center"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
