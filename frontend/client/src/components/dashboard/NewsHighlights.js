import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ClockIcon, TagIcon } from '@heroicons/react/outline';

const NewsHighlights = () => {
    const { news, loading } = useSelector(state => state.news);

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' years ago';
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' months ago';
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' days ago';
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' hours ago';
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' minutes ago';
        return Math.floor(seconds) + ' seconds ago';
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Latest News
            </h2>
            <div className="space-y-4">
                {news.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                    >
                        <div className="flex items-start">
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-20 h-20 object-cover rounded-lg mr-4"
                                />
                            )}
                            <div className="flex-1">
                                <h3 className="text-base font-medium text-gray-800 dark:text-white mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {item.summary}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center">
                                        <ClockIcon className="h-4 w-4 mr-1" />
                                        {formatTimeAgo(item.publishedAt)}
                                    </div>
                                    <div className="flex items-center">
                                        <TagIcon className="h-4 w-4 mr-1" />
                                        {item.category}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default NewsHighlights; 