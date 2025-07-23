import React from "react";

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    function BackdropClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center"
            onClick={BackdropClick}>
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white max-w-2xl w-full rounded-xl shadow-xl p-6 relative overflow-y-auto max-h-[85vh]">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-white hover:text-cyan-400 text-xl font-bold">
                    &times;
                </button>
                <h2 className="text-3xl font-bold mb-4">Privacy Policy 🕵️‍♀️</h2>
                <div className="text-sm leading-relaxed space-y-4">
                    <p>
                        At FUSE, your data is safer than your childhood crush's secret. We take your privacy seriously — because even we don't want our embarrassing memes leaked.
                    </p>
                    <p>
                        🔐 What we collect:
                        <ul className="list-disc list-inside pl-4">
                            <li>Name, email, and profile details</li>
                            <li>Your posts, likes, and comments (including your "rizz" attempts)</li>
                            <li>Some device data, but no spying. We're not CID.</li>
                        </ul>
                    </p>
                    <p>
                        👀 What we do with it:
                        <ul className="list-disc list-inside pl-4">
                            <li>Keep the app smooth like Amul butter</li>
                            <li>Improve your experience and recommend spicy memes</li>
                            <li>Absolutely NEVER sell your data. Not even for biryani.</li>
                        </ul>
                    </p>
                    <p>
                        🧹 Your control:
                        <ul className="list-disc list-inside pl-4">
                            <li>You can delete your account anytime (but we'll miss you 💔)</li>
                            <li>You control what you post. Just don't post your Aadhaar, please 🙏</li>
                        </ul>
                    </p>
                    <p>
                        Basically, your data is yours. We're just the babysitters making sure it doesn't eat glue.
                    </p>
                    <p>
                        *Note: If this policy ever changes, we'll update it faster than you can say "Nikal launde... privacy ka time aa gaya hai" 🫡
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyModal;