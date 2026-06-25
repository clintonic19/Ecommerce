import  { createAsyncThunk, createSlice }  from "@reduxjs/toolkit";
import axios from "axios";


//Initial state for the product slice
const initialState = {
  isLoading: false,
  productList : [],
  productDetails : null,
};

    //Fetch all filter products slice
export const filterAllProducts= createAsyncThunk('/products', 
    async ({filterParams, sortParams}) =>{
        try {  
            
            const query = new URLSearchParams(
                {
                    ...filterParams,
                    sortBy: sortParams
                }
            )
            //API Endpoint from Backend      
            const response = await axios?.get(`http://localhost:8001/api/shop/products/filter?${query}`.toLowerCase(), {
            withCredentials: true,
        });
        return response?.data;
        } catch (error) {
            console.log("Error in fetching all products", error);
            
        }
    });


    //Fetch product details slice
export const fetchProductDetails = createAsyncThunk('/products/fetchProductDetails', 
    async (id) =>{
        try {  
            //API Endpoint from Backend      
            const response = await axios?.get(`http://localhost:8001/api/shop/products/${id}`, {
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
    
        //extra reducers for handling async thunks for filterAllProducts
        extraReducers : (builder) =>{
            builder
            .addCase(filterAllProducts.pending, (state) =>{
                state.isLoading = true;
              }).addCase(filterAllProducts.fulfilled, (state, action)=>{
                state.isLoading = false
                state.productList = action?.payload?.data || []
              }).addCase(filterAllProducts.rejected, (state)=>{
                state.isLoading = false
                state.productList = []
              })
              //extra reducers for handling async thunks for fetchProductDetails
               .addCase(fetchProductDetails.pending, (state) =>{
                state.isLoading = true;
              }).addCase(fetchProductDetails.fulfilled, (state, action)=>{
                state.isLoading = false
                state.productDetails = action?.payload?.data || []
              }).addCase(fetchProductDetails.rejected, (state)=>{
                state.isLoading = false
                state.productDetails = null
              })
        }
    });

    export default shoppingViewProductSlice.reducer;
    