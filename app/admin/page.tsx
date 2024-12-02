"use client";
import { useEffect } from "react";
import { getPageName } from "@/app/utils/utils";

export default function Admin() {
    useEffect(() => {
        getPageName();
    }, []);

    const kpiData = [
        { title: "Revenue", value: "$54,321", icon: "pi pi-dollar", bgColor: "bg-green-100", textColor: "text-green-600" },
        { title: "New Users", value: "1,234", icon: "pi pi-users", bgColor: "bg-blue-100", textColor: "text-blue-600" },
        { title: "Orders", value: "879", icon: "pi pi-shopping-cart", bgColor: "bg-yellow-100", textColor: "text-yellow-600" },
        { title: "Feedback", value: "98%", icon: "pi pi-comments", bgColor: "bg-purple-100", textColor: "text-purple-600" },
    ];

    return (
        <div className="h-full bg-primaryBackgroundColor p-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Dashboard KPI </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => (
                    <div
                        key={index}
                        className={`flex items-center p-6 rounded-lg shadow-md ${kpi.bgColor} hover:scale-105 transform transition duration-200`}
                    >
                        <div className={`text-4xl p-4 rounded-full ${kpi.textColor}`}>
                            <i className={kpi.icon}></i>
                        </div>
                        <div className="ml-4">
                            <p className="text-lg font-medium text-gray-600">{kpi.title}</p>
                            <p className={`text-2xl font-bold ${kpi.textColor}`}>{kpi.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
