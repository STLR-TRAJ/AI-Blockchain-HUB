import React, { useEffect, useRef } from 'react';
import { createChart, LineStyle } from 'lightweight-charts';

const AssetChart = ({ data, color }) => {
    const chartContainerRef = useRef();
    const chartRef = useRef();

    useEffect(() => {
        if (!data || !chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 96,
            layout: {
                background: { type: 'transparent' },
                textColor: '#999',
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { visible: false },
            },
            rightPriceScale: { visible: false },
            timeScale: { visible: false },
            crosshair: {
                vertLine: { visible: false },
                horzLine: { visible: false },
            },
            handleScroll: false,
            handleScale: false,
        });

        const areaSeries = chart.addAreaSeries({
            lineColor: color,
            topColor: `${color}40`,
            bottomColor: `${color}00`,
            lineWidth: 2,
            priceLineVisible: false,
        });

        areaSeries.setData(data);
        chartRef.current = chart;

        const handleResize = () => {
            chart.applyOptions({
                width: chartContainerRef.current.clientWidth,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, color]);

    return (
        <div ref={chartContainerRef} className="w-full h-24" />
    );
};

export default AssetChart; 