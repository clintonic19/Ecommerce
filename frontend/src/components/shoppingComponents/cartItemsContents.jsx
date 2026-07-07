import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItems, updateCartItems } from "../../store/cart-slice/cartSlice";
import { toast } from 'sonner';

function UserCartItemsContent({cartItem, }) {

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCartSlice);

  const { productList } = useSelector((state) => state.shoppingViewProducts);
  const dispatch = useDispatch();

  // const handleUpdateQuantity = (getCartItem, typeOfAction) => {
  //   // Validate stock/item availability before increasing item quantity
  //   if (typeOfAction == "plus") {
  //     let getCartItems = cartItems?.items || [];   
      
  //     if (getCartItems.length) {   // Ensure cart contains items before performing validation
        
  //       // Find the index of the current item in the cart
  //       const indexOfCurrentCartItem = getCartItems?.findIndex(
  //         (item) => item?.productId === getCartItem?.productId
  //       );

  //         // Find the selected product in the product list
  //       const getCurrentProductIndex = productList.findIndex(
  //         (product) => product._id === getCartItem?.productId
  //       );

  //       const getTotalStock = productList[getCurrentProductIndex].totalStock;   // Retrieve the available stock for the selected product

  //       console.log("::", getCurrentProductIndex, getTotalStock, "getTotalStock");
        
  //           // Check if adding one more item exceeds available stock
  //       if (indexOfCurrentCartItem > -1) {
  //         const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
  //         if (getQuantity + 1 > getTotalStock) {
  //           toast({
  //             title: `Only ${getQuantity} quantity can be added for this item`,
  //             variant: "destructive",
  //           });

  //           return "Stock is limited"  // Stop execution if stock limit is exceeded
  //         }
  //       }
  //     }
  //   }

  //   dispatch(
  //     updateCartItems({
  //       userId: user?._id,
  //       productId: getCartItem?.productId,
  //       quantity:
  //         typeOfAction === "plus"
  //           ? getCartItem?.quantity + 1
  //           : getCartItem?.quantity - 1,
  //     })
  //   ).then((data) => {
  //     if (data?.payload?.success) {
  //       toast.success(data?.payload?.message, { 
  //           variant: "success", 
  //           position: "top-right",
  //         });
  //     }
  //   });
  // }

  // Update code to check limited product/items
  
  const handleUpdateQuantity = (getCartItem, typeOfAction) => {
  // Validate stock/item availability before increasing quantity
  if (typeOfAction === "plus") {
    const getCartItems = cartItems?.items || [];

    if (getCartItems.length) {

      // Find current item in cart
      const indexOfCurrentCartItem = getCartItems.findIndex(
        (item) => item?.productId === getCartItem?.productId
      );

      // Find product in product list
      const getCurrentProductIndex = productList.findIndex(
        (product) => product?._id === getCartItem?.productId
      );

      // Check if product exists
      if (getCurrentProductIndex === -1) {
        toast.error("Product not found");
        return;
      }

      const currentProduct = productList[getCurrentProductIndex];

      // Check if stock information exists
      if (!currentProduct || currentProduct.totalStock === undefined) {
        toast.error("Unable to verify stock availability");
        return;
      }

      const getTotalStock = currentProduct.totalStock;

      // Check if item exists in cart
      if (indexOfCurrentCartItem > -1) {
        const getQuantity =
          getCartItems[indexOfCurrentCartItem].quantity;

        // Prevent exceeding available stock
        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getTotalStock} item(s) available in stock`,
          );

          return; // Stop execution without breaking the app
        }
      }
    }
  }

  // Update cart item quantity
  dispatch(
    updateCartItems({
      userId: user?._id,
      productId: getCartItem?.productId,
      quantity:
        typeOfAction === "plus"
          ? getCartItem?.quantity + 1
          : getCartItem?.quantity - 1,
    })
  ).then((data) => {
    if (data?.payload?.success) {
      toast.success(data?.payload?.message, {
        position: "top-right",
      });
    } else {
      toast.error(
        data?.payload?.message || "Failed to update cart"
      );
    }
  });
};

  const handleCartItemDelete = (getCartItem) => {
    dispatch(
      deleteCartItems({ userId: user?._id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message, { 
            variant: "success", 
            position: "top-right",
          });
      }
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          
          {/* Increase products in cart */}
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          {/* Add quantity */}
          <span className="font-semibold">{cartItem?.quantity}</span> 
          
          {/* Decrease products in Cart */}
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>

      {/* Calcaulate the Items Added */}
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
  
}

export default UserCartItemsContent;