import React, { useState } from 'react'
import ShoppingHeader from '../../components/shoppingComponents/shoppingHeader'
import img from "../../assets/account.jpg"
import { useDispatch, useSelector } from 'react-redux';
import Address from '../../components/shoppingComponents/address';
import UserCartItemsContent from '../../components/shoppingComponents/cartItemsContents';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
// import axios from 'axios';
import { createOrder } from '../../store/order-slice/orderSlice';

const Checkout = () => {
   const { cartItems } = useSelector((state) => state.shoppingCartSlice);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch()
  const[isPayment, setIsPayment]=useState(false)
  const { callback_url } = useSelector((state)=>state.shopOrderSlice);

  // Calculate total cart amount 
const totalCartAmount =
  cartItems && cartItems.items && cartItems.items.length > 0
    ? cartItems.items.reduce(
      (sum, currentItem) =>
      sum + (currentItem?.salePrice > 0 ? currentItem?.salePrice  : currentItem?.price) * currentItem?.quantity, 0) : 0;
      
// Proceed to payment handler
const handleInitiatePaypalPayment = async()=>{

  if (cartItems.length === 0) {     
        toast.warning(
          "No Item in Cart. Please Add an Item to proceed.", { variant: "warning",  position: "top-right",}
      );

      return;
    }

  
  if (currentSelectedAddress === null) {
      toast.warning(
        "Please select one address to proceed.", { variant: "warning",  position: "top-right",}
      );
      return;
    }  

  const orderData ={

        userId : user?._id,
        email: user?.email,
        cartId: cartItems._id,

        cartItems : cartItems.items.map(cartItem=>({
        productId: cartItem?.productId,
        title: cartItem?.title,
        image: cartItem?.image,
        price: cartItem?.price,
        quantity: cartItem?.quantity,
        })),

        addressInfo :{
          addressId: currentSelectedAddress?._id,
          address: currentSelectedAddress?.address,
          city: currentSelectedAddress?.city,
          zipCode: currentSelectedAddress?.zipCode,
          phoneNo: currentSelectedAddress?.phoneNo,
          notes: currentSelectedAddress?.notes,
        },

        totalAmount: totalCartAmount,
        orderStatus: "Pending",
        paymentMethod: "PayStack",
        paymentStatus: "Pending",
        orderDate: new Date(),
        orderUpdateDate: new Date(),
      }

    // const res = await dispatch(createOrder(orderData))
    //   .then((data)=>{
    //     console.log("Log orderFormData Payment",data); 
    //     if(data?.payload?.success){
    //       console.log(":::",setIsPayment);
    //       setIsPayment(true);        
    //     }  else{
    //       setIsPayment(false)
    //     }
    //     return res;
    //   })

    // UPDATED CODE...............
    const result = await dispatch(createOrder(orderData));

      console.log("Result:", result);

      if (createOrder.fulfilled.match(result)) {
        setIsPayment(true);

        console.log("Payload:: ",result.payload);

        window.location.href = result.payload.authorizationUrl;
      } else {
        setIsPayment(false);

        console.log(result.payload); // Backend error (if using rejectWithValue)
        console.log("result error:: ", result.error);
      }

      console.log("Handle Payment", result);
  //  try {
  //   console.log("Handle Payment");

  //   const res = await axios.post(
  //     "http://localhost:8001/api/shop/order/initiate-payment",
  //     {
  //       userId: user?._id,
  //       email: user?.email,
  //       totalAmount: totalCartAmount *100
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   // if(res.status){
  //   //   window.location.href = res.data?.data?.authorization_url;
  //   // }

  //   if (res.data.success) {
  //     window.location.href = res.data.authorizationUrl;
  //   }

  //   console.log("Payment frontend:", res.data);
  // } catch (error) {
  //   console.error("Payment Error:", error.response?.data || error.message);
  // }   

    // if(res.status){
    //  window.location.href = callback_url;
    // }
}


// useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const reference = params.get("reference");

//     if (reference) {
//         verifyPayment(reference);
//     }
// }, []);

  return (
    <>
       <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">
                ${totalCartAmount}
                </span>
            </div>
          </div>
          <div className="mt-4 w-full">

            <Button 
            onClick={handleInitiatePaypalPayment} 
            className="w-full">
              {/* {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"} */}
                Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
    
    </>
  )
}

export default Checkout
