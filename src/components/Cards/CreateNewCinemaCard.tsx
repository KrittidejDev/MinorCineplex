import ModalEmpty from "../Modals/ModalEmpty"
import AdminInputTextField from "../Inputs/AdminInputTextField"
import AdminInputTextArea from "../Inputs/AdminInputTextArea"
import { useState } from "react"

interface CreateNewCinemaCardProps {
    isShowModal: boolean
    onClose: () => void
}

function CreateNewCinemaCard({ isShowModal, onClose }: CreateNewCinemaCardProps) {
    const [formData, setFormData] = useState({
        cinemaName: "",
        address: "",
        phoneNumber: "",
        details: ""
    })
    const [errors, setErrors] = useState({
        cinemaName: "",
        address: "",
        phoneNumber: "",
        details: ""
    })

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }))
        // Clear error when user starts typing
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }))
        }
    }

    const handleSave = () => {
        // Validation logic here
        const newErrors = {
            cinemaName: !formData.cinemaName ? "Cinema name is required" : "",
            address: !formData.address ? "Address is required" : "",
            phoneNumber: !formData.phoneNumber ? "Phone number is required" : "",
            details: !formData.details ? "Details is required" : ""
        }
        
        setErrors(newErrors)
        
        // If no errors, proceed with save
        if (!Object.values(newErrors).some(error => error)) {
            console.log("Saving cinema data:", formData)
            // Add your save logic here
        }
    }

    return (
        <ModalEmpty
            isShowModal={isShowModal}
            onClose={onClose}
        >
            <div className="bg-white w-[1200px] h-[784px] rounded-lg shadow-lg">
                <div className=" px-30 py-12.5  w-auto  ">
                    <h2 className="text-f-56 font-bold mb-6 text-gray-g63f ">Create New Cinema</h2>

                    <div className="mb-4">
                        <AdminInputTextField
                            label="Cinema Name"
                            placeholder="Enter cinema name"
                            value={formData.cinemaName}
                            onChange={handleInputChange("cinemaName")}
                            errors={errors.cinemaName}
                            require={true}
                        />
                    </div>

                    <div className="mb-4">
                        <AdminInputTextField
                            label="Address"
                            placeholder="Enter address"
                            value={formData.address}
                            onChange={handleInputChange("address")}
                            errors={errors.address}
                            require={true}
                        />
                    </div>

                    <div className="mb-4">
                        <AdminInputTextField
                            label="Phone number"
                            placeholder="Enter phone number"
                            value={formData.phoneNumber}
                            onChange={handleInputChange("phoneNumber")}
                            errors={errors.phoneNumber}
                            require={true}
                            type="tel"
                        />
                    </div>

                    <div className="mb-12.5">
                        <AdminInputTextArea
                            label="Details"
                            placeholder="Enter cinema detail"
                            value={formData.details}
                            onChange={handleInputChange("details")}
                            errors={errors.details}
                            require={true}
                            rows={8}
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-11 py-3 bg-blue-bbee text-fr-16 text-white-wfff rounded-md hover:bg-gray-300 opacity-40"
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

export default CreateNewCinemaCard