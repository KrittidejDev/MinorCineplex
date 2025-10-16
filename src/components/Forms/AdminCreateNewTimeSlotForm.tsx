import ModalEmpty from "../Modals/ModalEmpty"
import AdminInputTextField from "../Inputs/AdminInputTextField"
import AdminInputTextArea from "../Inputs/AdminInputTextArea"
import { useState } from "react"

interface AdminCreateNewTimeSlotFormProps {
    isShowModal: boolean
    onClose: () => void
}

function AdminCreateNewTimeSlotForm({ isShowModal, onClose }: AdminCreateNewTimeSlotFormProps) {
    const [formData, setFormData] = useState({
        timeSlotName: "",
        startTime: "",
        endTime: "",
        hallUsedIn: "",
    })
    const [errors, setErrors] = useState({
        timeSlotName: "",
        startTime: "",
        endTime: "",
        hallUsedIn: "",
    })
    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }))
     
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }))
        }
    }
    const handleSave = () => {
        const newErrors = {
            timeSlotName: !formData.timeSlotName ? "Time slot name is required" : "",
            startTime: !formData.startTime ? "Start time is required" : "",
            endTime: !formData.endTime ? "End time is required" : "",
            hallUsedIn: !formData.hallUsedIn ? "Hall used in is required" : "",
        }
        setErrors(newErrors)
        if (!Object.values(newErrors).some(error => error)) {
            console.log("Saving time slot data:", formData)
        }
    }
    return (
        <ModalEmpty isShowModal={isShowModal} onClose={onClose}>
            <div className="bg-white w-[1200px] h-auto rounded-lg shadow-lg">
                <div className=" px-30 py-12.5  w-auto  ">
                    <h2 className="text-f-56 font-bold mb-6 text-gray-g63f ">Create New Time Slot</h2>
                </div>
            </div>
        </ModalEmpty>
    )
        
}

export default AdminCreateNewTimeSlotForm