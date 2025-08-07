import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PENDING, REQUESTING, SUCCESS, ERROR } from "../../utilities/helper"
import { loginUserFirebase } from '../../services/firebase'

export const name = 'user'

export const initialState = {
    uid: '',
    email: '',
    firstName: '',
    lastName: '',
    status: PENDING
}

const reducers = {
    setUserState(state, { payload }) {
        const { uid, email, firstName, lastName } = payload;
        state.uid = uid;
        state.email = email;
        state.firstName = firstName;
        state.lastName = lastName;
    },
    setStatus(state, { payload }) {
        const { value } = payload;
        state.status = value
    }
}

const extraReducers = (builder) => {
    builder
        .addCase(loginUser.pending, (state) => {
            state.status = REQUESTING;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.status = SUCCESS;
        })
        .addCase(loginUser.rejected, (state) => {
            state.status = ERROR
        })
}

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (props) => {
        return loginUserFirebase(props)
            .then((userCredential) => {
                // important to mention here: here just the login is handled, copying the data from firestore to redux is handeled within useAuthentication-hook
                return userCredential.user
            })
            .catch(error => console.log(error));
    }
)

const slice = createSlice({
    name,
    initialState,
    reducers,
    extraReducers
})

export const {
    setUserState,
    setStatus
} = slice.actions

export default slice.reducer