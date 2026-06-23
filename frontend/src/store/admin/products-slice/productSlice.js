import  { createAsyncThunk, createSlice }  from "@reduxjs/toolkit";
import axios from "axios";


//Initial state for the product slice
const initialState = {
  isLoading: false,
  productList : []
};

//Add new product slice
export const addNewProduct = createAsyncThunk('/products/addNewProduct', 
    async (formData) =>{
        try {   
            //API Endpoint from Backend      
            const response = await axios?.post('http://localhost:8001/api/admin/products/add-product', formData, {
            withCredentials: true,
            headers:{
                'Content-Type': 'application/json'
            }
        });

        return response?.data;

        } catch (error) {
            console.log("Error in adding new product", error);
            
        }
    });

    //Fetch all products slice
export const fetchAllProducts= createAsyncThunk('/products', 
    async () =>{
        try {   
            //API Endpoint from Backend      
            const response = await axios?.get('http://localhost:8001/api/admin/products', {
            withCredentials: true,
        });

        return response?.data;

        } catch (error) {
            console.log("Error in fetching all products", error);
            
        }
    });

    //Edit/Update product slice
export const updateProducts= createAsyncThunk('/products/update', 
    async ({id, formData}) =>{
        try {   
            //API Endpoint from Backend      
            const response = await axios?.put(`http://localhost:8001/api/admin/products/edit-product/${id}`, formData, {
            withCredentials: true,
             headers:{
                'Content-Type': 'application/json'
            }
        });

        return response?.data;

        } catch (error) {
            console.log("Error in updating product", error);
            
        }
    });

    //Delete product slice
export const deleteProduct= createAsyncThunk('/products/delete', 
    async (id) =>{
        try {   
            //API Endpoint from Backend      
            const response = await axios?.delete(`http://localhost:8001/api/admin/products/delete-product/${id}`, {
            withCredentials: true,

        });

        return response?.data;

        } catch (error) {
            console.log("Error in deleting product", error);
            
        }
    });

const adminProductSlice = createSlice({
    name : "adminProduct",
    initialState,
    reducers : {},
    //extra reducers for handling async thunks
    extraReducers : (builder) =>{
        builder.addCase(fetchAllProducts.pending, (state) =>{ 
            state.isLoading = true;
          }).addCase(fetchAllProducts.fulfilled, (state, action)=>{
            state.isLoading = false
            state.productList = action?.payload?.data || []
          }).addCase(fetchAllProducts.rejected, (state, action)=>{
            state.isLoading = false
            state.productList = []
          })
    }
});

export default adminProductSlice.reducer;