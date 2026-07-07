import  { createAsyncThunk, createSlice }  from "@reduxjs/toolkit";
import axios from "axios";


//Initial state for the product slice
const initialState = {
  isLoading: false,
  cartItems : [],
};

//ADD TO CART ON THE FRONT END
export const addToCart= createAsyncThunk('cart/AddToCart', 
    async ({userId, productId, quantity}) =>{

        try {       
            console.log("CartSlice Log::",{
        userId,
        productId,
        quantity
      });  
            //API Endpoint from Backend      
            const response = await axios?.post(`http://localhost:8001/api/shop/carts/addToCart`, {
            userId, productId, quantity,     
        },
        {withCredentials: true,}
    );
        return response?.data;
        } catch (error) {
            console.log("Error in fetching all products", error);
            console.log(error.response?.data);
            throw error;
            
        }
    });

    // FETCH CART ITEMS WITH userId
export const fetchCartItems= createAsyncThunk('cart/fetchCartItems', 
    async (userId, ) =>{
        try {  
            
            //API Endpoint from Backend      
            const response = await axios?.get(`http://localhost:8001/api/shop/carts/${userId}`, {
            withCredentials: true,
        });
        return response?.data;
        } catch (error) {
            console.log("Error in fetching all products", error);  
        }
});

// UPDATE PRODUCT IN CART
export const updateCartItems= createAsyncThunk('cart/updateCartItems', 
    async ({userId, productId, quantity}) =>{
        try {  
            
            //API Endpoint from Backend      
            const response = await axios?.put(`http://localhost:8001/api/shop/carts/updateCart`, {
            userId, productId, quantity,
            withCredentials: true,
        });
        return response?.data;
        } catch (error) {
            console.log("Error in fetching all products", error);  
        }
});

// DELETE PRODUCT IN CART
export const deleteCartItems= createAsyncThunk('cart/deleteCartItems', 
    async ({userId, productId,}) =>{
        try {  
            
            //API Endpoint from Backend      
            const response = await axios?.delete(`http://localhost:8001/api/shop/carts/${userId}/${productId}`, {
            withCredentials: true,
        });
        return response?.data;
        } catch (error) {
            console.log("Error in fetching all products", error);  
        }
});

const shoppingCartSlice = createSlice({
    name: "shoppingCartSlice",
    initialState,
     reducers : {},

     //extra reducers for handling async thunks for ShoppingCartSlice
     extraReducers : (builder) =>{
            builder
            // Add to Cart Builder
            .addCase(addToCart?.pending,(state) =>{
                state.isLoading = true
            })
            .addCase(addToCart?.fulfilled,(state, action) =>{
                state.isLoading = false,
                console.log("payload data", action);
                state.cartItems = action?.payload?.data || []
                
            })
            .addCase(addToCart?.rejected,(state) =>{
                state.isLoading = false,
                state.cartItems = []
            })

              // fetchCartItems Builder
            .addCase(fetchCartItems?.pending,(state) =>{
                state.isLoading = true
            })
            .addCase(fetchCartItems?.fulfilled,(state, action) =>{
                state.isLoading = false,
                state.cartItems = action?.payload?.data || []
            })
            .addCase(fetchCartItems?.rejected,(state) =>{
                state.isLoading = false,
                state.cartItems = []
            })

              // updateCartItems Builder
            .addCase(updateCartItems?.pending,(state) =>{
                state.isLoading = true
            })
            .addCase(updateCartItems?.fulfilled,(state, action) =>{
                state.isLoading = false,
                state.cartItems = action?.payload?.data || []
            })
            .addCase(updateCartItems?.rejected,(state) =>{
                state.isLoading = false,
                state.cartItems = []
            })

              // deleteCartItems Builder
            .addCase(deleteCartItems?.pending,(state) =>{
                state.isLoading = true
            })
            .addCase(deleteCartItems?.fulfilled,(state, action) =>{
                state.isLoading = false,
                state.cartItems = action?.payload?.data || []
            })
            .addCase(deleteCartItems?.rejected,(state) =>{
                state.isLoading = false,
                state.cartItems = []
            })   
     }
});


export default shoppingCartSlice.reducer;