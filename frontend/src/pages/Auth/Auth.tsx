import { useRef } from 'react';

import './Auth.css'

import AuthBG from "./AuthBG"
import AuthSignup from "./AuthSignup"
import MessageBar from '../../components/MessageBar';
import { type MessageBarHandle } from '../../components/MessageBar';

// import { useDispatch } from 'react-redux';
// import { setUser, clearUser } from '../redux/sliceUser';

// import { type User, getInitialUser } from '../models/modelUser';


export default function Auth() {

    const msgRef = useRef<MessageBarHandle>(null);

    return (
        <>
            <AuthSignup showMsg={(msg: string, color?: string) => msgRef.current?.showMsg(msg, color)} />
            <MessageBar ref={msgRef} />
            <AuthBG />
        </>
    )
}




// --------------------------- Form Demo ---------------------------------
// const { register, handleSubmit } = useForm<User>({
//   defaultValues: getInitialUser(),
// });




// --------------------------- Redux Demo ---------------------------------

// const handleLogin = (userData: User) => {
//   dispatch(setUser(userData));
// };

// const handleLogout = () => {
//   dispatch(clearUser());
// };