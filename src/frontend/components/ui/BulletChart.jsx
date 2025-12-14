"use client";

import { useEffect, useRef } from "react";

const BulletChart = ({ value = 0, label = "Bullet" }) => {

    const chartRef = useRef(null);
    const refValue = useRef(0);

    useEffect(() => {

        const Plot = require('plotly.js-dist');

        if (chartRef.current) {
            const data = [
                {
                    type: "indicator",
                    mode: "number+gauge+delta",
                    value: value,
                    delta: { reference: refValue.current, increasing: { color: "Red" }, decreasing: { color: "green" } },
                    gauge: {
                        shape: "bullet",
                        axis: { range: [0, 500], tickwidth: 1, tickcolor: "white" }, // PPM range example
                        bar: { color: "white", thickness: 0.75 },
                        bgcolor: "transparent",
                        steps: [
                            { range: [0, 100], color: "green" },
                            { range: [100, 300], color: "orange" },
                            { range: [300, 500], color: "red" }
                        ],
                        threshold: {
                            line: { color: "red", width: 2 },
                            thickness: 0.75,
                            value: 250
                        }
                    }
                }
            ]

            const layout = {
                title: { text: label, font: { size: 24, color: "white" } },
                autosize: true,
                margin: { t: 90, r: 20, l: 60, b: 40 },
                paper_bgcolor: "transparent",
                font: { color: "white", family: "Arial" }
            };

            const config = { responsive: true, displayModeBar: false };

            // Initialize or update plot
            if (chartRef.current.data) {
                Plot.react(chartRef.current, data, layout, config);
            } else {
                Plot.newPlot(chartRef.current, data, layout, config);
            }
        }

        // Update reference value for next render
        refValue.current = value;

    }, [value, label])

    return (
        <div ref={chartRef} className="w-full h-full"></div>
    );

}

export default BulletChart;
