'use client';

import { useEffect, useRef } from 'react';

/**
 * TimeSeriesChart Component
 * Simple line chart to display historical sensor data
 * 
 * @param {Object} props
 * @param {Array<{timestamp: string, value: number}>} props.data - Array of sensor data points
 */
export default function TimeSeriesChart({ data = [] }) {
    const chartRef = useRef(null);

    useEffect(() => {
        const renderChart = async () => {
            if (!chartRef.current || data.length === 0) return;

            const Plotly = await import('plotly.js-dist');

            // Extract timestamps and values
            const timestamps= data.map(item =>
                new Date(item.ts).toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                    hour: "2-digit",
                    minute: "2-digit"
                })
            );
            const values = data.map(item => item.value);

            // Simple line chart
            const trace = {
                x: timestamps.reverse(),
                y: values.reverse(),
                type: 'scatter',
                mode: 'lines+markers',
                line: { color: '#3b82f6', width: 2 },
                marker: { color: '#3b82f6', size: 4 }
            };

            // Minimal layout
            const layout = {
                autosize: true,
                margin: { l: 50, r: 30, t: 30, b: 50 },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#e5e7eb' },
                xaxis: { gridcolor: '#374151' },
                yaxis: { gridcolor: '#374151' }
            };

            // Simple config
            const config = {
                responsive: true,
                displayModeBar: false
            };

            Plotly.default.newPlot(chartRef.current, [trace], layout, config);
        };

        renderChart();
    }, [data]);

    return (
        <div className="flex flex-col w-full h-full min-h-[400px] bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
            <div ref={chartRef} className="flex-1 w-full" />
        </div>
    );
}
