import SignInForm from "../Forms/SignInForm";
import ModalEmpty from "../Modals/ModalEmpty";

type FormValues = {
  email: string;
  password: string;
};

interface ModalLoginProps {
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  onLogin: (values: FormValues) => void;
}
const ModalLogin = ({
  showLoginModal,
  setShowLoginModal,
  onLogin,
}: ModalLoginProps) => {
  return (
    <ModalEmpty
      isShowModal={showLoginModal}
      onClose={() => setShowLoginModal(false)}
    >
      <div className="w-md px-15 py-8 bg-gray-g63f flex flex-col items-center rounded-2xl">
        <SignInForm onSubmit={onLogin} />
      </div>
    </ModalEmpty>
  );
};
export default ModalLogin;
