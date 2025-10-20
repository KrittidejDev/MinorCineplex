import ModalEmpty from "../Modals/ModalEmpty"
import AdminInputTextField from "../Inputs/AdminInputTextField"
import AdminInputTextArea from "../Inputs/AdminInputTextArea"
import TimeLight from "../Icons/TimeLight"
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


                    <div className="mt-6 flex flex-col gap-5 mb-4">
                        <AdminInputTextField
                            label="Time Slot Name"
                            type="text"
                            value={formData.timeSlotName}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder="e.g.,Morning Slot"




                        />
                    </div>

                    <div className="flex gap-4 mb-10">
                        <div className="flex-1">
                            <AdminInputTextField
                                label="Start Time"
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => handleInputChange('startTime')(e)}
                                require={true}
                                icon={<TimeLight />}

                            />
                        </div>
                        <div className="flex-1">
                            <AdminInputTextField
                                label="End Time"
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => handleInputChange('endTime')(e)}
                                require={true}
                                icon={<TimeLight />}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center my-4">
                        <div className="w-full h-px bg-blue-bbee"></div>
                    </div>


                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
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