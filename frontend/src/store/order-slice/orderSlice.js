import  { createAsyncThunk, createSlice }  from "@reduxjs/toolkit";
import axios from "axios";

//Initial state for the product slice
const initialState = {
callback_url : null,
isLoading: false,
orderId: null
};

export const createOrder = createAsyncThunk('order/createOrder', async(orderData) =>{
    try{
         //API Endpoint from Backend      
            const response = await axios?.post(`http://localhost:8001/api/shop/order/initiate-payment`, orderData,
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
});


const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers : {},
          //extra reducers for handling async thunks for addressSlice
        extraReducers : (builder) =>{
            builder
                // addAddress Builder
                .addCase(createOrder?.pending,(state) =>{
                     state.isLoading = true
                    })
                .addCase(createOrder?.fulfilled,(state, action) =>{
                    state.isLoading = false
                    // state.addressList = action?.payload?.data || []  
                    state.callback_url = action?.payload?.callback_url     
                    state.orderId = action?.payload?.orderId     
                    })
                .addCase(createOrder?.rejected,(state, action) =>{
                    state.isLoading = false
                    state.callback_url = null
                    state.orderId = null

                    console.log("Rejected Payload:", action.payload);
                    console.log("Rejected Error:", action.error);
                    })   
                    
                  }
})
export default orderSlice.reducer;
