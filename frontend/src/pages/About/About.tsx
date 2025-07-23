import React, { useState } from "react";
import GradientText from "../../reactbits/GradientText/GradientText";

import PrivacyPolicyModal from "./PrivacyPolicyModal";
import TermsModal from "./TermsModal";


function About() {
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    return (
        <>
            <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
            <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />

            <div className="flex flex-col justify-center items-center h-full w-full inset-0 p-4 text-white z-1 select-none">

                <div className="text-center text-5xl font-bold mt-6 mb-4">
                    <GradientText
                        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                        animationSpeed={6}
                        showBorder={false}
                        className="custom-class">
                        FUSE
                    </GradientText>
                </div>

                <div className="flex-grow w-full max-w-xl flex flex-col items-center">
                    <div className="w-full rounded-xl p-6 overflow-y-auto max-h-[400px] border border-white/20">
                        <p className="text-lg leading-relaxed whitespace-pre-line p-4">
                            {`Welcome to FUSE - the ultimate timepass turned tech startup that nobody asked for, but here we are 🚀

                            Post your thoughts, rants, and chai-fueled breakdowns in neat little categories (yes, no more putting gym selfies under "Tech"). Chat with strangers who think "Abe sale coding kar le" is motivational enough 💻.

                            It's like Instagram, but your mom's not here. Like Reddit, but nobody's judging your grammar. Like WhatsApp groups, but you can *leave* peacefully.

                            Want to vibe with someone over "JCB ki khudai"? We got a category for that too. From "Bhagwan bharose devs" to "Moye moye"-loving memers, you'll find your people here 😭🔥

                            FUSE = Where chaos meets category. Vibing is mandatory, logic is optional.

                            *Note: If this app starts lagging... just blame the government or Mercury retrograde.* 🙃`}
                        </p>
                    </div>

                    <div className="flex gap-6 text-blue-400 underline cursor-pointer mt-4 text-sm">
                        <a onClick={() => setShowPrivacy(true)}>Privacy Policy</a>
                        <a onClick={() => setShowTerms(true)}>Terms & Conditions</a>
                    </div>
                </div>

                <div className="w-full max-w-xl mt-10 border-t border-white/10 pt-4 text-center">
                    <div className="text-sm text-gray-400">
                        Developed by{" "}
                        <span className="inline-block">
                            <GradientText
                                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                                animationSpeed={6}
                                showBorder={false}
                                className="inline font-semibold tracking-wider">
                                -DK-
                            </GradientText>
                        </span>
                    </div>
                </div>

            </div>

        </>
    );
}

export default React.memo(About);