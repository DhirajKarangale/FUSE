import './Auth.css'

import AuthBG from "./AuthBG"
import AuthSignup from "./AuthSignup"

// import { useDispatch } from 'react-redux';
// import { setUser, clearUser } from '../redux/sliceUser';

// import { type User, getInitialUser } from '../models/modelUser';


export default function Authentication() {
    return (
        <>
            <AuthSignup />
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
