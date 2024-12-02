"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { ChartCategoryProps } from "@/app/interface/chart/ChartCategoryPropsDTO";
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



export default function ChartCategory({ categoriesData }: ChartCategoryProps) {
  const [chartData, setChartData] = useState<ChartData<"line"> | null>(null);

  useEffect(() => {
    const labels = categoriesData.map((category) => category.name);
    const values = categoriesData.map((category) => category.productCount);

    setChartData({
      labels,
      datasets: [
        {
          label: "Nombre de produits par catégorie",
          data: values,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    });
  }, [categoriesData]);

  return (
    <div className="p-6 bg-primaryBackgroundColor h-full">
        
                                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Graphique</h1>
      {chartData ? <Line data={chartData} /> : <p>Chargement des données...</p>}
    </div>
  );
}