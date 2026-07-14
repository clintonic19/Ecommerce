import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import AdminOrderDetails from './adminOrder-details'

const AdminOrders = () => {
const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const handleFetchOrderDetails =(getId) => {
    // dispatch(getOrderDetailsForAdmin(getId));
    console.log("Fetching order details for order ID:", getId);
  }
  return (
    <>
     <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>2023-08-01</TableCell>
              <TableCell>Shipped</TableCell>
              <TableCell>$100.00</TableCell>
              <TableCell>
                <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
                    <Button className='mt-2 mb-2' onClick={() => setOpenDetailsDialog(true)}>
                        View Details
                    </Button> 
                <AdminOrderDetails/> 
                </Dialog>                    
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </CardContent>
  </Card>
      
    </>
  )
}

export default AdminOrders
