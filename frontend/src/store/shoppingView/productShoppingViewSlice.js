import  { createAsyncThunk, createSlice }  from "@reduxjs/toolkit";
import axios from "axios";


//Initial state for the product slice
const initialState = {
  isLoading: false,
  productList : []
};

    //Fetch all products slice
export const filterAllProducts= createAsyncThunk('/products', 
    async () =>{
        try {   
            //API Endpoint from Backend      
            const response = await axios?.get('http://localhost:8001/api/shop/products/filter', {
            withCredentials: true,
        });

        return response?.data;

        } catch (error) {
            console.log("Error in fetching all products", error);
            
        }
    });

    const shoppingViewProductSlice = createSlice({
        name : "shoppingViewProductSlice",
        initialState,
        reducers : {},
    
        //extra reducers for handling async thunks
        extraReducers : (builder) =>{
            builder.addCase(filterAllProducts.pending, (state) =>{
                state.isLoading = true;
              }).addCase(filterAllProducts.fulfilled, (state, action)=>{
                console.log("action payload:::", action?.payload.data);         
                state.isLoading = false
                state.productList = action?.payload?.data || []
              }).addCase(filterAllProducts.rejected, (state, action)=>{
                console.log("action payload:::", action.payload);         
                state.isLoading = false
                state.productList = []
              })
        }
    });

    export default shoppingViewProductSlice.reducer;
    