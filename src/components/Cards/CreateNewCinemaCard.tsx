import { Modal } from "../ui/Modal"

interface CreateNewCinemaCardProps {
    isShowModal: boolean
    onClose: () => void
}

function CreateNewCinemaCard({ isShowModal, onClose }: CreateNewCinemaCardProps) {
    return (
        
            <div className="flex items-center justify-center w-[1200px] h-[784px] bg-white">
                <div className=" rounded-lg shadow-lg p-6 w-auto ">
                    <h2 className="text-f-56 font-bold mb-6 text-gray-g63f ">Create New Cinema</h2>

                    <div className="mb-4">
                        <label className="block text-fr-16  text-blue-bbee mb-1">Cinema Name</label>
                        <input
                            type="text"
                            placeholder="Enter cinemaname"
                            className="w-full px-4 py-2 border border-blue-bbee rounded-md text-gray-g3b0"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-fr-16  text-blue-bbee mb-1">Address</label>
                        <input
                            type="text"
                            placeholder="Enter address"
                            className="w-full px-3 py-2 border border-blue-bbee rounded-md text-gray-g3b0"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-fr-16  text-blue-bbee mb-1">Phone number</label>
                        <input
                            type="text"
                            placeholder="Enter phone number"
                            className="w-full px-3 py-2 border border-blue-bbee rounded-md text-gray-g3b0 "
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-fr-16  text-blue-bbee mb-1">Details</label>
                        <textarea
                            placeholder="Enter cinema detail"
                            rows={4}
                            className="w-full px-3 py-2 border border-blue-bbee rounded-md resize-y text-gray-g3b0"
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Save
                        </button>
                    </div>
                </div>
            </div>
       
    )
}

export default CreateNewCinemaCard