import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert, removeAlert } from '../../store/slices/alertsSlice';

const AlertsPanel = ({ asset }) => {
    const dispatch = useDispatch();
    const [priceTarget, setPriceTarget] = useState('');
    const [alertType, setAlertType] = useState('above');
    const alerts = useSelector(state => state.alerts.items);

    const handleAddAlert = () => {
        if (!priceTarget) return;

        dispatch(addAlert({
            symbol: asset.symbol,
            type: alertType,
            price: parseFloat(priceTarget),
            createdAt: new Date().toISOString()
        }));

        setPriceTarget('');
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                Price Alerts
            </h3>
            <div className="flex space-x-2 mb-4">
                <input
                    type="number"
                    value={priceTarget}
                    onChange={(e) => setPriceTarget(e.target.value)}
                    placeholder="Price target"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                </select>
                <button
                    onClick={handleAddAlert}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Add Alert
                </button>
            </div>
            <div className="space-y-2">
                {alerts
                    .filter(alert => alert.symbol === asset.symbol)
                    .map((alert) => (
                        <div
                            key={alert.id}
                            className="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded-lg"
                        >
                            <span className="text-gray-800 dark:text-white">
                                {alert.type === 'above' ? '↑' : '↓'} ${alert.price}
                            </span>
                            <button
                                onClick={() => dispatch(removeAlert(alert.id))}
                                className="text-red-500 hover:text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default AlertsPanel; 