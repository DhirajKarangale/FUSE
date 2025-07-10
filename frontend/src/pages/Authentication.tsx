import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../redux/sliceUser';

import { type User, getInitialUser } from '../models/modelUser';


export default function Authentication() {

    return (
        <>
            <h1>Authentication</h1>
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
