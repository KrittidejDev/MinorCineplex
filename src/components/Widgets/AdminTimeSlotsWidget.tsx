import AddRoundLight from "../Icons/AddRoundLight"
import { Button } from "../ui/button"
import TableCard from "../Cards/TableCard"
import { useState } from "react"

export default function AdminTimeSlotsWidget() {
    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-between items-center px-15 mt-20">
                <h1 className="text-f-56 text-gray-g63f">Time Slots</h1>
            </div>
        </div>
    )
}