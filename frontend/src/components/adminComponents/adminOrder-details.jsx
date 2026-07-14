import React, { useState } from 'react'
import { Label } from '../ui/label'
import { DialogContent } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { useSelector } from 'react-redux'
import CommonForm from '../common/form'
import { Table } from 'lucide-react'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const initialFormData = {
  status: "",
};

const AdminOrderDetails = ({orderDetails }) => {
    const { user } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState(initialFormData);

    const handleUpdateStatus = (e) =>{
        e.preventDefault();
        // Dispatch action to update order status
        console.log("Updating order status to:", formData.status);
        const { status } = formData;

    // dispatch(
    //   updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    // ).then((data) => {
    //   if (data?.payload?.success) {
    //     dispatch(getOrderDetailsForAdmin(orderDetails?._id));
    //     dispatch(getAllOrdersForAdmin());
    //     setFormData(initialFormData);
    //     toast({
    //       title: data?.payload?.message,
    //     });
    //   }
    // });

    }

  return (
    <>
       <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID:</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date:</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price:</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method:</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status:</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status:</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details:</div>
            <ul className="grid gap-3">
              {/* {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li className="flex items-center justify-between">
                      <span>Title: {item.title}1</span>
                      <span>Quantity: {item.quantity}2</span>
                      <span>Price: ${item.price}3</span>
                    </li>
                  ))
                : null} */}

                <li className="flex items-center justify-between">
                      <span>Title: 1</span>
                      <span>Quantity: 2</span>
                      <span>Price: $3</span>
                </li>

                {/* <Table >
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title:</TableHead>
                            <TableHead>Quantity:</TableHead>
                            <TableHead>Price:</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell> Books</TableCell>
                        <TableCell>Quantity: 2</TableCell>
                        <TableCell>Price: $3</TableCell>
                    </TableRow>
                </TableBody>
                </Table> */}
                
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info:</div>
            <div className="grid gap-1 text-muted-foreground">
              <span>Full name: {user.firstName} {user.lastName}</span>
              <span>Address: {orderDetails?.addressInfo?.address} No. 5 New road</span>
              <span>City: {orderDetails?.addressInfo?.city}Port Harcourt</span>
              <span>Zip Code: {orderDetails?.addressInfo?.zipCode} 50090</span>
              <span>Phone: {orderDetails?.addressInfo?.phoneNo} 09089878765</span>
              <span>Notes: {orderDetails?.addressInfo?.notes} Send</span>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Select Order Status:",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "Shipped" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            FormData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
    </>
  )
}

export default AdminOrderDetails
