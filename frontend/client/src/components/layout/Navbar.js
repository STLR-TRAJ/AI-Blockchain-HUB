import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon, UserCircleIcon, CogIcon } from '@heroicons/react/outline';

const Navbar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [notifications, setNotifications] = useState([]);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
                                AI Blockchain Hub
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <BellIcon className="h-6 w-6" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                                )}
                            </Menu.Button>
                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                No new notifications
                                            </div>
                                        ) : (
                                            notifications.map(notification => (
                                                <Menu.Item key={notification.id}>
                                                    <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                </Menu.Item>
                                            ))
                                        )}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        {/* User Menu */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                <UserCircleIcon className="h-8 w-8" />
                                <span>{user?.username}</span>
                            </Menu.Button>
                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <Menu.Item>
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                Profile
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                Settings
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                                            >
                                                Logout
                                            </button>
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 