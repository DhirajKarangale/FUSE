import React from "react";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
                <h2 className="text-3xl font-bold mb-4">Terms & Conditions 📜</h2>
                <div className="text-sm leading-relaxed space-y-4">
                    <p>
                        Welcome to FUSE - the app where chaos meets category and your memes matter more than your resume.
                    </p>
                    <p>
                        ⚠️ By using this app, you agree to:
                        <ul className="list-disc list-inside pl-4">
                            <li>Not post anything your nani wouldn't approve of 👵</li>
                            <li>No spamming, unless it's actual canned spam pics</li>
                            <li>Respect others. Or at least pretend like you do</li>
                        </ul>
                    </p>
                    <p>
                        🛠 The app is provided as-is. If it breaks, cries, or refuses to load — just blame the nearest Mercury retrograde 🌌
                    </p>
                    <p>
                        📦 Content Rights:
                        <ul className="list-disc list-inside pl-4">
                            <li>You own your content. We just showcase it, like those talent shows your mom forced you into.</li>
                            <li>If your meme goes viral, tag us bro. Don't ghost.</li>
                        </ul>
                    </p>
                    <p>
                        🧠 Intellectual Property:
                        <ul className="list-disc list-inside pl-4">
                            <li>Our code, logo, and app design are ours. Stealing it will not bring you peace, only lawyer notices 📬</li>
                        </ul>
                    </p>
                    <p>
                        If you agree to these terms, swipe right. Just kidding — click "close" and enjoy responsibly 🙃
                    </p>
                    <p>
                        *Note: Violators may be banned, or worse, turned into a meme.* 😎
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;