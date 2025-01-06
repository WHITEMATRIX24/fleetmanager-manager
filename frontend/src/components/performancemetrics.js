import React, { useRef, useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './PerformanceMetrics.css';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale);

// Custom plugin to draw each bar with two separate colors
const dualColorBarsPlugin = {
    id: 'dualColorBars',
    beforeDatasetsDraw(chart, args, options) {
        const { ctx, chartArea: { top, bottom }, scales: { x, y } } = chart;

        chart.getDatasetMeta(0).data.forEach((bar, index) => {
            const halfWidth = bar.width / 2;
            const leftColor = options.colors.left[index];
            const rightColor = options.colors.right[index];

            const base = y.getPixelForValue(0);
            const barHeight = base - bar.y;

            console.log(`Drawing bar for index ${index} with colors ${leftColor} and ${rightColor}`);
            console.log(`Bar coordinates: x=${bar.x}, y=${bar.y}, height=${barHeight}, width=${bar.width}`);

            // Draw left half
            ctx.fillStyle = leftColor;
            ctx.fillRect(bar.x - halfWidth, bar.y, halfWidth, barHeight);

            // Draw right half
            ctx.fillStyle = rightColor;
            ctx.fillRect(bar.x, bar.y, halfWidth, barHeight);
        });
    }
};

ChartJS.register(dualColorBarsPlugin);

function PerformanceMetrics() {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({
        labels: ['SUV', 'MPV', 'Sedan', 'Limousine', 'Bus'],
        datasets: [
            {
                label: 'Revenue',
                data: [0, 0, 0, 0, 0],
                barThickness: 20,
            },
        ],
    });

    const fetchData = async () => {
        try {
            // Fetch trips and vehicles data
            const tripsResponse = await fetch('http://localhost:5000/api/trips');
            const vehiclesResponse = await fetch('http://localhost:5000/api/vehicles');

            const trips = await tripsResponse.json();
            const vehicles = await vehiclesResponse.json();

            // Calculate revenue per vehicle type
            const revenueByType = {
                SUV: 0,
                MPV: 0,
                Sedan: 0,
                Limousine: 0,
                Bus: 0,
            };

            trips.forEach((trip) => {
                const vehicle = vehicles.find(v => v.vehicleNumber === trip.vehicleNumber);
                if (vehicle) {
                    revenueByType[vehicle.vehicleType] += trip.tripRemunaration;
                }
            });

            setChartData({
                labels: ['SUV', 'MPV', 'Sedan', 'Limousine', 'Bus'],
                datasets: [
                    {
                        label: 'Revenue',
                        data: [revenueByType.SUV, revenueByType.MPV, revenueByType.Sedan, revenueByType.Limousine, revenueByType.Bus],
                        barThickness: 20,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();

        return () => {
            if (chartRef.current && chartRef.current.chartInstance) {
                chartRef.current.chartInstance.destroy();
            }
        };
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false },
                ticks: { display: false },
                categoryPercentage: 1,
                barPercentage: 0.9,
            },
            y: {
                grid: { display: true, color: '#e0e0e0' },
                ticks: { display: true, color: '#000', font: { size: 10 } },
                beginAtZero: true,
            },
        },
        plugins: {
            legend: { display: false },
            dualColorBars: {
                colors: {
                    left: ['#A9A9A9', '#8E7C61', '#B7A488', '#7E6B4F', '#6F5940'],
                    right: ['#A9A9A9', '#82704F', '#AB976E', '#766542', '#6A543A']
                }
                ,
            },
        },
    };

    return (
        <div className="performance-metrics">
            <div className="legend">
                <h2>CAR REVENUE <br /> PERFORMANCE <br /></h2>
                <ul>
                    <li><span className="color-box" style={{ backgroundColor: '#A9A9A9' }}></span> SUV</li>
                    <li><span className="color-box" style={{ backgroundColor: '#8E7C61' }}></span> MPV</li>
                    <li><span className="color-box" style={{ backgroundColor: '#B7A488' }}></span> Sedan</li>
                    <li><span className="color-box" style={{ backgroundColor: '#7E6B4F' }}></span> Limousine</li>
                    <li><span className="color-box" style={{ backgroundColor: '#6F5940' }}></span> Bus</li>
                </ul>
            </div>
            <div className="chart-container">
                <Bar ref={chartRef} data={chartData} options={options} />
            </div>
        </div>
    );
}

export default PerformanceMetrics;
