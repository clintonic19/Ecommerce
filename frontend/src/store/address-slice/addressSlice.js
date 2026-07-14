import  { createAsyncThunk, createSlice }  from "@reduxjs/toolkit";
import axios from "axios";

//Initial state for the product slice
const initialState = {
  isLoading: false,
  addressList : [],
};

// ADD NEW ADDRESS
export const addAddress = createAsyncThunk('address/addAddress', async(formData) =>{
    try{
         //API Endpoint from Backend      
            const response = await axios?.post(`http://localhost:8001/api/shop/address/add-address`, formData, 
        {
            withCredentials: true,
            headers:{
                'Content-Type': 'application/json'
            }
        });
        return response?.data;
    }catch(err){
        console.error("Error adding address:", err);
        console.error("Response::", err.response?.data);
        throw err;

    }
})

// FETCH ADDRESS with userId
export const fetchAddress = createAsyncThunk('address/fetchAddress', async(userId) =>{
    try{
         //API Endpoint from Backend      
            const response = await axios?.get(`http://localhost:8001/api/shop/address/fetch-address/${userId}`, 
        {
            withCredentials: true,

        });

        return response?.data;

    }catch(err){
        console.error("Error adding address:", err);
        throw err;
    }
})

// EDIT ADDRESS with userId and addressId
export const updateAddress = createAsyncThunk('address/updateAddress', async({userId, addressId, formData}) =>{
    try{
         //API Endpoint from Backend      
            const response = await axios?.put(`http://localhost:8001/api/shop/address/edit-address/${userId}/${addressId}`, formData, 
        {
            withCredentials: true,

        });

        return response?.data;
        
    }catch(err){
        console.error("Error adding address:", err);
        throw err;
    }
});

// DELETE ADDRESS with userId and addressId
export const deleteAddress = createAsyncThunk('address/deleteAddress', async({userId, addressId,}) =>{
    try{
         //API Endpoint from Backend      
            const response = await axios?.delete(`http://localhost:8001/api/shop/address/delete-address/${userId}/${addressId}`,  
        {
            withCredentials: true,

        });

        return response?.data;
        
    }catch(err){
        console.error("Error adding address:", err);
        throw err;
    }
})



const addressSlice = createSlice({
    name: "address",
    initialState,
     reducers : {},

      //extra reducers for handling async thunks for addressSlice
         extraReducers : (builder) =>{
                builder
                // addAddress Builder
                .addCase(addAddress?.pending,(state) =>{
                    state.isLoading = true
                })
                .addCase(addAddress?.fulfilled,(state, action) =>{
                    state.isLoading = false
                    // state.addressList = action?.payload?.data || []
                    
                })
                .addCase(addAddress?.rejected,(state) =>{
                    state.isLoading = false
                    // state.addressList = []
                })
    
                  // fetchAddress Builder
                .addCase(fetchAddress?.pending,(state) =>{
                    state.isLoading = true
                })
                .addCase(fetchAddress?.fulfilled,(state, action) =>{
                    state.isLoading = false,
                    state.addressList = action?.payload?.data || []
                })
                .addCase(fetchAddress?.rejected,(state) =>{
                    state.isLoading = false,
                    state.addressList = []
                })
    
                  // updateAddress Builder
                .addCase(updateAddress?.pending,(state) =>{
                    state.isLoading = true
                })
                .addCase(updateAddress?.fulfilled,(state, action) =>{
                    state.isLoading = false,
                    state.addressList = action?.payload?.data || []
                })
                .addCase(updateAddress?.rejected,(state) =>{
                    state.isLoading = false,
                    state.addressList = []
                })
    
                  // deleteAddress Builder
                .addCase(deleteAddress?.pending,(state) =>{
                    state.isLoading = true
                })
                .addCase(deleteAddress?.fulfilled,(state, action) =>{
                    state.isLoading = false,
                    state.addressList = action?.payload?.data || []
                })
                .addCase(deleteAddress?.rejected,(state) =>{
                    state.isLoading = false,
                    state.addressList = []
                })   
         }
});

export default addressSlice.reducer;