import ModalEmpty from "../Modals/ModalEmpty"

interface CreateNewCinemaCardProps {
    isShowModal: boolean
    onClose: () => void
}

function CreateNewCinemaCard({ isShowModal, onClose }: CreateNewCinemaCardProps) {
    return (
        <ModalEmpty
            isShowModal={isShowModal}
            onClose={onClose}
        >
            <div className="bg-white w-[1200px] h-[784px] rounded-lg shadow-lg">
                <div className=" px-30 py-12.5  w-auto ">
                    <h2 className="text-f-56 font-bold mb-6 text-gray-g63f ">Create New Cinema</h2>

                    <div className="mb-4">
                        <label className="block text-fr-16  text-blue-bbee mb-1">Cinema Name</label>
                        <input
                            type="text"
                            placeholder="Enter cinemaname"
                            className="w-full px-3 py-3 border border-blue-bbee rounded-md text-gray-g3b0 "
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-fr-16  text-blue-bbee mb-1">Address</label>
                        <input
                            type="text"
                            placeholder="Enter address"
                            className="w-full px-3 py-3 border border-blue-bbee rounded-md text-gray-g3b0 "
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-fr-16  text-blue-bbee mb-1">Phone number</label>
                        <input
                            type="text"
                            placeholder="Enter phone number"
                            className="w-full px-3 py-3 border border-blue-bbee rounded-md text-gray-g3b0 "
                        />
                    </div>

                    <div className="mb-12.5">
                        <label className="block text-fr-16  text-blue-bbee mb-1">Details</label>
                        <textarea
                            placeholder="Enter cinema detail"
                            rows={8}
                            className="w-full px-3 py-2 border border-blue-bbee rounded-md resize-y text-gray-g3b0  "
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-11 py-3 bg-blue-bbee text-fr-16 text-white-wfff rounded-md hover:bg-gray-300 opacity-40"
                        >
                            Cancel
                        </button>
                        <button className=" text-fr-16 px-11 py-3 text-white-wfff bg-blue-bbee  rounded-md hover:bg-blue-b9a8">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </ModalEmpty>
    )
}

export default CreateNewCinemaCard