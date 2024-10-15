"use client"
import {useEffect} from "react";
import {getPageName} from "@/app/utils/utils";

export default function Dashboard() {

    useEffect(() => {
        getPageName();
    }, [])
    return (
        <div>
            <h1>Page Dashboard </h1>
        </div>
    );
}