import { ModalLayout } from "../components/HeadlessUI";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({
  open,
  title,
  message,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  if (!open) return null;

  return (
    <ModalLayout showModal toggleModal={onClose}>
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-red-600">{title}</h3>

        <p className="text-gray-700">{message}</p>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ConfirmModal;
