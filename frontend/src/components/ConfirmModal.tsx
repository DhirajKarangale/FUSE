type Props = {
    isOpen: boolean;
    message: string;
    onClose: () => void;
    onConfirm: () => void; // <-- the function you want to call after confirm
};

const ConfirmModal = ({ isOpen, message, onClose, onConfirm }: Props) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-black/80 border border-white/10 text-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                <p className="text-sm text-white/90">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 text-sm text-white/70 hover:text-white border border-white/20 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm(); // ⬅️ call the function passed
                            onClose();   // close the modal
                        }}
                        className="px-4 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;