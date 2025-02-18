import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    HomeIcon, 
    ChartBarIcon, 
    NewspaperIcon, 
    LightningBoltIcon,
    CogIcon,
    UserGroupIcon,
    DocumentTextIcon
} from '@heroicons/react/outline';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: HomeIcon, path: '/' },
        { name: 'Financial Analysis', icon: ChartBarIcon, path: '/financial-analysis' },
        { name: 'Political Updates', icon: NewspaperIcon, path: '/political-updates' },
        { name: 'AI Insights', icon: LightningBoltIcon, path: '/ai-insights' },
        { name: 'Board Meetings', icon: UserGroupIcon, path: '/board-meetings' },
        { name: 'Reports', icon: DocumentTextIcon, path: '/reports' },
        { name: 'Settings', icon: CogIcon, path: '/settings' }
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64">
                <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <img
                                className="h-8 w-auto"
                                src="/logo.svg"
                                alt="AI Blockchain Hub"
                            />
                        </div>
                        <nav className="mt-5 flex-1 px-2 space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                        isActive(item.path)
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <item.icon
                                        className={`mr-3 flex-shrink-0 h-6 w-6 ${
                                            isActive(item.path)
                                                ? 'text-white'
                                                : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                                        }`}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center">
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Market Status
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Market is Open
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar; 