import { useState, useEffect } from "react";

import Loader from "../../components/Loader";

import GetMessage from "../../utils/MessagesManager";

import { urlOTP } from "../../api/APIs";
import { getRequest, postRequest } from "../../api/APIManager";

import { type UserData } from "../../models/modelUser";

type AuthSignupProps = {
    ShowMsg: (msg: string, color?: string) => void;
    SetUser: (user: UserData) => void;
    SetNextScreen: (currScreen: string) => void;
};

export default function AuthSignup({ ShowMsg: showMsg, SetUser, SetNextScreen: NextScreen }: AuthSignupProps) {
    const [isOtp, setIsOTP] = useState<boolean>(false);
    const [isSlideUp, setIsSlideUp] = useState<boolean>(false);
    const [isSlideLeft, setIsSlideLeft] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [otp, setOTP] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    useEffect(() => {
        setTimeout(() => { setIsSlideUp(true); }, 50);
    }, [])


    async function ButtonContinue() {
        const otpRegex = /^\d{6}$/;
        if (!otpRegex.test(otp)) {
            showMsg(GetMessage('otpInvalid'), 'red');
            return;
        }

        setIsLoading(true);
        const body = { email, otp };
        const { data, error } = await postRequest<UserData>(`${urlOTP}`, body);

        if (data) {
            showMsg(GetMessage('otpVerified'), 'green');
            setIsSlideLeft(true);
            SetUser(data);
            setTimeout(() => { NextScreen('SignUp'); }, 500);
        } else {
            showMsg(error, 'red');
        }

        setIsLoading(false);
    }

    async function ButtonOTP() {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            showMsg(GetMessage('emailInvalid'), 'red');
            return;
        }

        setIsLoading(true);
        const { data, error } = await getRequest<string>(`${urlOTP}?email=${email}`);

        if (data) {
            setIsOTP(true);
            showMsg(data, 'green');
        } else {
            showMsg(error, 'red');
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
                            onChange={(e: any) => setEmail(e.target.value)}
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
                            onChange={(e: any) => setOTP(e.target.value)}
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

            </div>
        </>
    );
}