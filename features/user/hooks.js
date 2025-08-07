import { useDispatch, useSelector } from 'react-redux'
import { setUserState, loginUser } from './userSlice';


export const useUser = () => {

    const dispatch = useDispatch();

    const user = useSelector(state => state.user);
    const isLoadingUser = useSelector(state => state.user.status);
    // here we create a hook for thening() all the data

    return ({
        userState: user,
        isLoadingUser: isLoadingUser,
        setUserState: (user) => dispatch(setUserState(user)),
        loginUser: (props) => dispatch(loginUser(props))
    })

}