import { useState, useEffect } from "react";

import Loader from "../../components/Loader";

import { urlOTP } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";

export default function AuthSignup() {
    const [isOtp, setIsOTP] = useState<boolean>(false);
    const [isSlideUp, setIsSlideUp] = useState<boolean>(false);
    const [isSlideLeft, setIsSlideLeft] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [msg, setMsg] = useState<string>('');
    const [msgColor, setMsgColor] = useState<string>('white');


    useEffect(() => {
        setTimeout(() => {
            setIsSlideUp(true);
        }, 50);
    }, [])

    async function ButtonContinue() {

        setMsg('');
        setIsSlideLeft(true);

        setTimeout(() => {
            // move to next page
        }, 500);
    }

    async function ButtonOTP() {

        setIsLoading(true);
        const { data, error } = await getRequest<string>(`${urlOTP}?email=dakarangale02@gmail.com`);

        if (data) {
            setIsOTP(true);
            setMsg(data);
            setMsgColor('green');
        } else {
            setMsg(error);
            setMsgColor('red');
        }
        setIsLoading(false);
    }

    return (

        <>
            {isLoading && <Loader />}

            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">

                <div className={`w-82 px-6 pt-6 pb-6 rounded-2xl bg-black/25 backdrop-blur-sm
                                pointer-events-auto shadow-lg relative overflow-hidden
                                transform transition-all duration-1000 ease-in-out
                                ${isSlideLeft ? "opacity-0 -translate-x-full" : isSlideUp ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>

                    <div className="px-1">
                        <label htmlFor="email" className="block text-white text-lg font-semibold mb-2">
                            Enter Your Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="example@email.com"
                            className="w-full p-3 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>

                    <div className={`transform transition-all duration-1000 ease-in-out overflow-hidden px-1 pb-1
                                    ${isOtp ? "opacity-100 translate-y-0 mt-4 max-h-96" : "opacity-0 -translate-y-10 mt-0 max-h-0"}`}>

                        <label htmlFor="otp" className="block text-white text-lg font-semibold mb-2">
                            Enter OTP
                        </label>
                        <input
                            type="number"
                            id="otp"
                            placeholder="123456"
                            className="w-full p-3 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400
                                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>

                    <div className="px-1 mt-6 flex justify-between items-center">
                        <button
                            onClick={ButtonOTP}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2 px-4 rounded-lg">
                            Send OTP
                        </button>

                        <button
                            onClick={ButtonContinue}
                            className={`bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transform transition-all duration-1000 ease-in-out overflow-hidden
                                        ${isOtp ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
                            Continue
                        </button>

                    </div>
                </div>

                <div className="fixed bottom-16 w-full flex justify-center pointer-events-none z-50">
                    <p className="text-center text-lg font-bold" style={{ color: msgColor }}>
                        {msg}
                    </p>
                </div>

            </div>
        </>
    );
}