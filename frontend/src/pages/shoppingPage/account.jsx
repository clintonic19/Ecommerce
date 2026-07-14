import { useEffect } from "react";
import accImg from "../../assets/account.jpg";
import Address from "../../components/shoppingComponents/address";
import ShoppingOrders from "../../components/shoppingComponents/orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

import React from 'react'
import axios from "axios";
// import ShoppingHeader from '../../components/shoppingComponents/shoppingHeader'

const Account = () => {

  useEffect(() => {
    const verifyPayment = async () => {
      // Get the reference from the URL
      const params = new URLSearchParams(window.location.search);
      const reference = params.get("reference");

      // If user just opened the page normally, do nothing
      if (!reference) return;

      try {
        const response = await axios.get(
          `http://localhost:8001/api/payments/verify-payment/${reference}`
        );

        console.log("Payment Verification:", response.data);

        if (
          response.data.status &&
          response.data.data.status === "success"
        ) {
          alert("Payment Successful!");

          // Remove reference from URL so refresh doesn't verify again
          window.history.replaceState({}, "", window.location.pathname);

          // TODO:
          // 1. Save order to your database
          // 2. Clear cart
          // 3. Navigate to success page
        } else {
          alert("Payment verification failed.");
        }
      } catch (error) {
        console.error(
          "Verification Error:",
          error.response?.data || error.message
        );
      }
    };

    verifyPayment();
  }, []);

  return (
    <>
      <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <Address /> 
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </>
  )
}

export default Account
