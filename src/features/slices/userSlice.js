// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import authAxiosClient from '../../api/authAxiosClient';
import useToast from '../../Component/ToastProvider/useToast';


// Unauthenticated API call
export const fetchPublicUsers = createAsyncThunk(
    'user/fetchPublicUsers',
    async (_, thunkAPI) => {
        try {
            const res = await axiosClient.get('/users/public');
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error');
        }
    }
);

// Authenticated API call
export const fetchPrivateUsers = createAsyncThunk(
    'user/fetchPrivateUsers',
    async (_, thunkAPI) => {
        try {
            const res = await authAxiosClient.get('/users/private');
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error');
        }
    }
);




export const login = createAsyncThunk(
    'user/login',
    async (data, thunkAPI) => {
        try {
            const res = await axiosClient.post('/user/login', data);
            window.localStorage.setItem("user", JSON.stringify(res.data?.data))
            return res.data;
        } catch (err) {
            console.log('error00', err.response.data.message)
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error');
        }
    }
);





const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        error: null,
        authData: {}
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.authData = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


        // // Public users
        // .addCase(fetchPublicUsers.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        // })
        // .addCase(fetchPublicUsers.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.publicUsers = action.payload;
        // })
        // .addCase(fetchPublicUsers.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // })

        // // Private users
        // .addCase(fetchPrivateUsers.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        // })
        // .addCase(fetchPrivateUsers.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.privateUsers = action.payload;
        // })
        // .addCase(fetchPrivateUsers.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // });
    },
});

export default userSlice.reducer;
