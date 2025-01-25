"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { ChartDataPointDto } from "@/app/interface/chartDataPoint/ChartDataPointDto";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


interface RevenueChartData extends ChartData<'line'> {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        fill: boolean;
        borderColor: string;
        tension: number;
    }[];
}

const MAX_DATA_POINTS = 20;


const INITIAL_CHART_DATA: RevenueChartData = {
    labels: [],
    datasets: [
        {
            label: "Revenu en temps réel (€)",
            data: [],
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
        },
    ],
};

export default function RevenueChart() {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [chartData, setChartData] = useState<RevenueChartData>(INITIAL_CHART_DATA);

    useEffect(() => {
        const eventSource = new EventSource('/api/sse/revenue');

        eventSource.onopen = () => {
            setIsConnected(true);
        };

        eventSource.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data) as ChartDataPointDto;
            
            setChartData(prevData => {
                const newLabels = [...prevData.labels, new Date(data.timestamp).toLocaleTimeString()];
                const newData = [...prevData.datasets[0].data, data.amount];

                if (newLabels.length > MAX_DATA_POINTS) {
                    newLabels.shift();
                    newData.shift();
                }

                return {
                    labels: newLabels,
                    datasets: [
                        {
                            ...prevData.datasets[0],
                            data: newData,
                        },
                    ],
                };
            });
        };

        eventSource.onerror = (error: Event) => {
            console.error('Erreur SSE:', error);
            setIsConnected(false);
            eventSource.close();
        };

        return () => {
            eventSource.close();
            setIsConnected(false);
        };
    }, []);

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Revenus en temps réel'
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(tickValue: number | string, index: number, ticks: any) {
                        const value = Number(tickValue);
                        if (isNaN(value)) return '';
                        return `${value.toLocaleString('fr-FR')} €`;
                    }
                }
            }
        }
    };

    return (
        <div className="p-6 bg-primaryBackgroundColor h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 text-center">
                    Revenus en temps réel
                </h1>
                <div className="flex items-center">
                    <span className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-sm text-gray-600">
                        {isConnected ? 'Connecté en temps réel' : 'Déconnecté'}
                    </span>
                </div>
            </div>
            <Line data={chartData} options={options} />
        </div>
    );
} 