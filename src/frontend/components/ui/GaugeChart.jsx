"use client";

import { useEffect, useRef } from "react";

// Sửa lại gaugechart để nhận thêm tham số, tái sử dụng lại cho cả temperature với water
const GaugeChart = ({ value = 0, label = "Gauge" }) => {

  const gaugeRef = useRef(null);
  const refValue = useRef(0);

  useEffect(() => {

    const Plot = require('plotly.js-dist');

    if (gaugeRef.current) {
      const data = [
        {
          type: "indicator",
          mode: "gauge+number+delta",
          value: value,
          delta: { reference: refValue.current, increasing: { color: "Red" }, decreasing: { color: "green" } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "white" },
            bar: { color: "transparent", thickness: 0, line: { color: "white", width: 35 } },
            bgcolor: "transparent",
            // borderwidth: 2,
            // bordercolor: "gray",
            steps: [
              { range: [0, 30], color: "green" },
              { range: [30, 60], color: "orange" },
              { range: [60, 100], color: "red" }
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: 50
            }
          }
        }
      ]

      // Responsive layout
      const layout = {
        title: { text: label, font: { size: 24, color: "white" } },
        autosize: true,
        margin: { t: 60, r: 20, l: 20, b: 20 },
        paper_bgcolor: "transparent",
        font: { color: "white", family: "Arial" }
      };

      const config = { responsive: true, displayModeBar: false };

      // Initialize or update plot
      if (gaugeRef.current.data) {
        Plot.react(gaugeRef.current, data, layout, config);
      } else {
        Plot.newPlot(gaugeRef.current, data, layout, config);
      }
    }

    // Update reference value for next render
    refValue.current = value;

  }, [value, label])

  return (
    <div ref={gaugeRef} className="w-full h-full"></div>
  );

}

export default GaugeChart;