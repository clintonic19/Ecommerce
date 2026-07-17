import React from 'react'
import { Card, CardHeader, CardTitle } from '../../components/ui/card'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { paymentOrder } from '../../store/order-slice/orderSlice';

const PayStack = () => {
    const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentReference = params.get("paymentReference");
//   const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentReference) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(paymentOrder({ paymentReference, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paymentReference, dispatch]);

  return (
    <>
     <Card>
      <CardHeader>
        <CardTitle>Processing Payment... Please wait!</CardTitle>
      </CardHeader>
    </Card>
      
    </>
  )
}

export default PayStack
