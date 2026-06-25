import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice/authSlice';
import adminProductSlice from './admin/products-slice/productSlice';
import shoppingViewProductSlice from './shoppingView/productShoppingViewSlice';
import shoppingCartSlice from "./cart-slice/cartSlice"

const store = configureStore({
    reducer: {
            
        auth: authReducer,
        adminProducts: adminProductSlice,
        shoppingViewProducts: shoppingViewProductSlice,
        shoppingCartSlice : shoppingCartSlice
    },

    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(apiSlice.middleware),
    //     devTools: true,
});

export default store;

// format to installing dependencies
//npx shadcn@latest add skeleton
