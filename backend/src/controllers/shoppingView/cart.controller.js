const Cart = require('../../models/Cart.models');
const Product = require('../../models/products.models');

// Add items to the cart for a specific user
const addItemsToCart = async (req, res) => {
    try{
        const { userId, productId, quantity } = req.body;
        
        if (!userId || !productId || !quantity || quantity <= 0) {
            return res.status(400).json({ 
                success: false,
                message: 'All Fields are required' 
            });
        };

        // Check if the product exists
        const product = await Product.findById(productId);
          
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found'
            });
        };

        // Check if the item already exists in the cart
        let cartItem = await Cart.findOne({ userId });

        if(!cartItem) {
            // If the item doesn't exist, create a new cart item 
            // (adding to the cart for the first time)
            cartItem = new Cart({ userId, items: [] });
        };

        // Check if the product already exists in the cart
        const existingItemIndex = cartItem.items.findIndex(item => item.productId.toString() === productId);
        
        // if(existingItemIndex !== -1) { 
        //     // If the product doesn't exist, add it to the cart
        //     cartItem.items.push({ productId, quantity });
        // }else{
        //     // If the product already exists, update the quantity
        //     cartItem.items[existingItemIndex].quantity += quantity;
        // }

        //Updated Code block
        if (existingItemIndex === -1) {
            cartItem.items.push({ productId, quantity: Number(quantity) });
        } else {
                cartItem.items[existingItemIndex].quantity =
                cartItem.items[existingItemIndex].quantity + Number(quantity);
            };
        await cartItem.save(); // Save the cart item to the database

        res.status(200).json({ 
            success: true,
            message: 'Item added to Cart successfully', 
            data: cartItem 
        });

    }catch(err){
        res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

// Fetch cart items for a specific user
const fetchCartItems = async (req, res) => {
    try{
         const{ userId } = req.params;

         if(!userId) {
            return res.status(400).json({ 
                success: false,
                message: 'User ID is required' 
            });
         }

         const cartItems = await Cart.findOne({ userId }).populate({ 
            path: 'items.productId',
            select: 'title price salePrice description image'
         }); // Fetch the cart items for the user and populate product details

         if(!cartItems) {
            return res.status(404).json({ 
                success: false,
                message: 'No cart items found' 
            });
         };

        // Filter out any cart items that don't have a valid product
        const validCartItems = cartItems.items.filter((item) => item.productId );

        if(validCartItems.length < cartItems.items.length) {
            // If some cart items don't have valid products, update the cart
            cartItems.items = validCartItems;
            await cartItems.save();
        }

        const populatedCartItems = validCartItems.map(item => ({
            productId: item.productId._id,
            title: item.productId.title,
            price: item.productId.price,
            description: item.productId.description,
            image: item.productId.image,
            salePrice : item.productId.salePrice,
            quantity: item.quantity
        }));

            res.status(200).json({
                success: true,
                message: 'Cart items fetched successfully',
                data: { 
                    ...cartItems._doc, 
                    items: populatedCartItems 
                } // Return the cart items with populated product details
            });

    }catch(err){
        res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

// Update cart items for a specific user
const updateCartItems = async (req, res) => {
    try{
          const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity || quantity <= 0) {
            return res.status(400).json({ 
                success: false,
                message: 'All Fields are required' 
            });
        };
        const cartItems = await Cart.findOne({userId}) // Fetch the cart items for the user

         if(!cartItems) {
            return res.status(404).json({ 
                success: false,
                message: 'No cart items found' 
            });
         };

          // Check if the product already exists in the cart
        const existingItemIndex = cartItems.items.findIndex(item => item.productId.toString() === productId);
        
        if(existingItemIndex !== -1) { 
           return res.status(404).json({
                success: false,
                message: 'Product not found in the cart' 
            });
        };

        cartItems.items[existingItemIndex].quantity = quantity; // Update the quantity of the product in the cart

        await cartItems.save(); // Save the updated cart items to the database
        await cartItems.populate({ 
            path: 'items.productId', 
            select: 'title price salePrice description image' 
        }); // Populate product details

        const populatedCartItems = cartItems.items.map(item => ({
            // productId: item.productId ? item.productId._id : null,
            // title: item.productId ? item.productId.title : null,
            // price: item.productId ? item.productId.price : null,
            // description: item.productId ? item.productId.description : null,
            // image: item.productId ? item.productId.image : null,
            // quantity: item.quantity

             productId: item.productId ? item.productId._id : null,
            title: item.productId ? item.productId.title : null,
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            description: item.productId ? item.productId.description : null,
            image: item.productId ? item.productId.image : null,
            quantity: item.quantity
        }));

          res.status(200).json({
                success: true,
                message: 'Cart items updated successfully',
                data: { 
                    ...cartItems._doc, 
                    items: populatedCartItems, 
                } // Return the cart items with populated product details
            });
        

    }catch(err){
        res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

const deleteCartItems = async (req, res) => {
    try{
          const { userId, productId } = req.params;

        if (!userId || !productId) {
            return res.status(400).json({ 
                success: false,
                message: 'All Fields are required' 
            });
        };

        const cartItems = await Cart.findOne({userId}).populate({ 
            path: 'items.productId', 
            select: 'title price salePrice description image' }); // Fetch the cart items for the user

         if(!cartItems) {
            return res.status(404).json({ 
                success: false,
                message: 'No cart items found' 
            });
         };

        // Filter out the item to be deleted from the cart items
        cartItems.items = cartItems.items.filter(item => item.productId._id.toString() !== productId);

        await cartItems.save(); // Save the updated cart items to the database
        await cartItems.populate({ path: 'items.productId', select: 'title price salePrice description image' }); // Fetch the cart items for the user

         const populatedCartItems = cartItems.items.map(item => ({
            // productId: item.productId ? item.productId._id : null,
            // title: item.productId ? item.productId.title : null,
            // price: item.productId ? item.productId.price : null,
            // description: item.productId ? item.productId.description : null,
            // image: item.productId ? item.productId.image : null,
            // quantity: item.quantity
             productId: item.productId ? item.productId._id : null,
            title: item.productId ? item.productId.title : null,
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            description: item.productId ? item.productId.description : null,
            image: item.productId ? item.productId.image : null,
            quantity: item.quantity
        }));

        res.status(200).json({
            success: true,
            message: 'Cart Item deleted successfully',
            data: { 
                ...cartItems._doc, 
                items: populatedCartItems, 
            } // Return the cart items with populated product details
        });
        
    }catch(err){
        res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}
module.exports = {
    addItemsToCart,
    fetchCartItems,
    updateCartItems,
    deleteCartItems
}