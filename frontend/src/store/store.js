import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice/authSlice';
import adminProductSlice from './admin/products-slice/productSlice';
import shoppingViewProductSlice from './shoppingView/productShoppingViewSlice';
import shoppingCartSlice from "./cart-slice/cartSlice"
import shopAddressSlice from "./address-slice/addressSlice"
import shopOrderSlice from "./order-slice/orderSlice"
import adminUsersSlice from "./admin/users-slice/usersSlice"

const store = configureStore({
    reducer: {
            
        auth: authReducer,
        adminProducts: adminProductSlice,
        shoppingViewProducts: shoppingViewProductSlice,
        shoppingCartSlice : shoppingCartSlice,
        shopAddressSlice : shopAddressSlice,
        shopOrderSlice : shopOrderSlice,
        adminUsers: adminUsersSlice,
    },

    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(apiSlice.middleware),
    //     devTools: true,
});

export default store;

// format to installing dependencies
//npx shadcn@latest add skeleton
