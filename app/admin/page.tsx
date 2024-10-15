"use client"
import {getPageName} from "@/app/utils/utils";
import {useEffect} from "react";

export default function Admin() {
    useEffect(() => {
        getPageName()
    }, []);
    return (
        <div>
            <h1>Page Admin </h1>
        </div>
    );
}