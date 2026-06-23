import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//Initial state for the auth slice
const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};



//Register user slice
export const registerUser = createAsyncThunk('/auth/register',
    async(formData,) =>{
        try {
            const res = await axios?.post(
                'http://localhost:8001/api/auth/register', formData,
                {
                withCredentials: true,
                // headers: {
                //     'Content-Type': 'application/json',
                // },
            });
            return res?.data;
        } catch (error) {
            console.log("Error in user registration", error);
        }
    }
)

//Login user slice
export const loginUser = createAsyncThunk('/auth/login',
    async(formData,) =>{
        try {
            const res = await axios?.post(
                'http://localhost:8001/api/auth/login', formData,
                {
                withCredentials: true,
                // headers: {
                //     'Content-Type': 'application/json',
                // },
            });
            return res?.data;
        } catch (error) {
            console.log("Error in user login", error);
        }
    }
)

//Logout user slice
//Login user slice
export const logoutUser = createAsyncThunk('/auth/logout',
    async() =>{
        try {
            const res = await axios?.post(
                'http://localhost:8001/api/auth/logout', {},
                {
                withCredentials: true,
                // headers: {
                //     'Content-Type': 'application/json',
                // },
            });
            return res?.data;
        } catch (error) {
            console.log("Error in user login", error);
        }
    }
)

//Check authentication slice
export const checkAuth = createAsyncThunk('/auth/check-auth',
    async() =>{
        try {
            const res = await axios?.get(
                'http://localhost:8001/api/auth/check-auth', 

                {
                withCredentials: true,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
                    // 'Content-Type': 'application/json',
                },
            });
            return res?.data;
        } catch (error) {
            console.log("Error in user authentication check", error);
        }
    }
)




//Auth slice
// ---> createSlice from Redux Toolkit to manage authentication state
// ---> Handles user registration with async thunk
const authSlice = createSlice({

    name: "auth",
    initialState,

    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        }
    },

    // Extra reducers for handling async actions
    //async actions for register user && tank method
    extraReducers: (builder) =>{
        builder
        // Async actions for register user
            .addCase(registerUser.pending, (state) =>{
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) =>{
                state.isLoading = false;
                state.user = action.payload?.user || action.payload;
                // state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) =>{
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || "Registration failed";
            })

            //async actions for login user && tank method
            .addCase(loginUser.pending, (state) =>{
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) =>{
                console.log("Login filled action", action);
                state.isLoading = false;
                // state.user = action.payload?.user || action.payload;
                state.user = action.payload?.success ? action?.payload?.user : null;
                // state.isAuthenticated = true;
                state.isAuthenticated = action?.payload?.success ? true : false;
            })
            .addCase(loginUser.rejected, (state, action) =>{
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || "Login failed";
            })

            //async actions for checkAuth && tank method;
             .addCase(checkAuth.pending, (state) =>{
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) =>{
                console.log("Login filled action", action);
                state.isLoading = false;
                // state.user = action.payload?.user || action.payload;
                state.user = action.payload?.success ? action?.payload?.user : null;
                // state.isAuthenticated = true;
                state.isAuthenticated = action?.payload?.success ? true : false;
            })
            .addCase(checkAuth.rejected, (state, action) =>{
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || "Login failed";
                
                // Logout user 
            }).addCase(logoutUser.fulfilled, (state, action) =>{
                console.log("Logout filled action", action);
                state.isLoading = false;
                state.user =  null;
                state.isAuthenticated = false;
            });
}

});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;