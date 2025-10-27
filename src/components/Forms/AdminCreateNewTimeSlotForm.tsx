import ModalEmpty from "../Modals/ModalEmpty"
import AdminInputTextField from "../Inputs/AdminInputTextField"
import AdminInputTextArea from "../Inputs/AdminInputTextArea"
import TimeLight from "../Icons/TimeLight"
import AdminTimeInput from "../Inputs/AdminTimeInput"
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
    const handleCancel = () => {
        setFormData({
            timeSlotName: "",
            startTime: "",
            endTime: "",
            hallUsedIn: "",
        })
        setErrors({
            timeSlotName: "",
            startTime: "",
            endTime: "",
            hallUsedIn: "",
        })
        onClose()
    }

    const validateTimeRange = (startTime: string, endTime: string) => {
        if (!startTime || !endTime) return ""
        
        const start = new Date(`2000-01-01T${startTime}`)
        const end = new Date(`2000-01-01T${endTime}`)
        
        if (end <= start) {
            return "End time must be later than start time"
        }
        return ""
    }


    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setFormData(prev => ({
        ...prev,
        [field]: newValue
    }))

    // Clear existing error for this field
    if (errors[field as keyof typeof errors]) {
        setErrors(prev => ({
            ...prev,
            [field]: ""
        }))
    }

    // Validate time range when either start or end time changes
    if (field === 'startTime' || field === 'endTime') {
        const startTime = field === 'startTime' ? newValue : formData.startTime
        const endTime = field === 'endTime' ? newValue : formData.endTime
        
        if (startTime && endTime) {
            const timeError = validateTimeRange(startTime, endTime)
            setErrors(prev => ({
                ...prev,
                endTime: timeError
            }))
        }
    }
}
    const handleSave = () => {
        const timeRangeError = validateTimeRange(formData.startTime, formData.endTime)
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


                    <div className="mt-6 flex flex-col gap-5 mb-4">
                        <AdminInputTextField
                            label="Time Slot Name"
                            type="text"
                            value={formData.timeSlotName}
                            onChange={ handleInputChange(`timeSlotName`)}
                            placeholder="e.g.,Morning Slot"




                        />
                    </div>

                    <div className="flex gap-4 mb-10">
                        <div className="flex-1">
                            <AdminTimeInput
                                label="Start Time"
                                value={formData.startTime}
                                onChange={(e) => handleInputChange('startTime')(e)}
                                require={true}
                                errors={errors.startTime}
                            />
                        </div>
                        <div className="flex-1">
                            <AdminTimeInput
                                label="End Time"
                                value={formData.endTime}
                                onChange={(e) => handleInputChange('endTime')(e)}
                                require={true}
                                errors={errors.endTime}
                            />
                        </div>
                    </div>


                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={handleCancel}
                            className="px-11 py-3 bg-blue-bbee text-fr-16 text-white-wfff rounded-md hover:bg-gray-g3b0 opacity-40"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className=" text-fr-16 px-11 py-3 text-white-wfff bg-blue-bbee  rounded-md hover:bg-blue-b9a8"
                        >
                            Save
                        </button>
                    </div>

                </div>
            </div>
        </ModalEmpty>
    )

}

export default AdminCreateNewTimeSlotForm