import ModalEmpty from "../Modals/ModalEmpty"

function CreateNewCinemaCard() {
    return (
        <ModalEmpty isShowModal={true} onClose={() => { }}>
            <div>
                <h1>Create New Cinema</h1>
            </div>
        </ModalEmpty>
    )
}