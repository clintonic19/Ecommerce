
import { Dialog, DialogContent } from '@/components/ui/dialog'
import React from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { StarIcon } from 'lucide-react'
import { Input } from '../ui/input'
import { addToCart, fetchCartItems } from '../../store/cart-slice/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { setProductDetails } from '../../store/shoppingView/productShoppingViewSlice'


const ProductDetailsContent = ({productDetails, open, setOpen}) => {
  // handle ADD product to CART
  const dispatch = useDispatch();
  const {user} = useSelector(state=>state.auth)

const handleAddToCart = (currentProductId)=>{
   
   dispatch(addToCart({userId : user._id, productId : currentProductId, quantity : 1 }))
   .then((data) => {
    if(data?.payload?.success){
      dispatch(fetchCartItems(user._id));
        toast.success(data?.payload?.message, { 
               variant: "success", 
               position: "top-right",
             });
   } else {
      toast.error(
         data?.payload?.message || "Failed to add item",
         { 
          variant: "success", 
          position: "top-right",
        }
      );
    }
   }); 
};

// Dialog close for product details
const handleProductDetailsDialogClose = () =>{
  setOpen(false)
  dispatch(setProductDetails())
}

  return (
    <>
    <Dialog open={open} onOpenChange={handleProductDetailsDialogClose} >
        <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
            <div className="relative overflow-hidden rounded-lg">
                {/* Product Image */}
                <img src={productDetails?.image} alt={productDetails?.title} 
                    width={600}
                    height={600}
                    className="aspect-square w-full object-cover"
                />
            </div>
            {/* Product Information */}
            <div className="">
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <div>
                <p className="text-muted-foreground text-2xl mb-5 mt-4">
                {productDetails?.description}
            </p>
            </div>

              {/* Product Price */}
            <div className="flex items-center justify-between">
            <span
                className={`text-3xl font-bold ${
                productDetails?.salePrice > 0
                    ? "line-through text-muted-foreground"
                    : "text-primary"
                }`}
            >
                ${productDetails?.price}
            </span>
                {productDetails?.salePrice > 0 && (
                    <span className="text-3xl font-bold text-primary">
                    ${productDetails.salePrice}
                    </span>
                )}
            </div>
            {/* ratings */}
            <div className="flex items-center gap-2 mt-2">
              <StarIcon className="w-5 h-5 fill-primary"/>
              <StarIcon className="w-5 h-5 fill-primary"/>
              <StarIcon className="w-5 h-5 fill-primary"/>
              <StarIcon className="w-5 h-5 fill-primary"/>
              <StarIcon className="w-5 h-5 fill-primary"/>
            <span className="text-muted-foreground">(4.5)</span>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )}
              >
                Add to Cart
              </Button>
            )}
          </div>
            <Separator />

            {/* Reviews or get details of the product */}
            <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold">Username</h3>
                    </div>

                       {/* comment/review rating */}
                      <div className="flex items-center gap-0.5">
                        {/* <StarRatingComponent  /> */}
                        <StarIcon className='w-5 h-5 fill-primary'/>
                        <StarIcon className='w-5 h-5 fill-primary'/>
                        <StarIcon className='w-5 h-5 fill-primary'/>
                        <StarIcon className='w-5 h-5 fill-primary'/>
                        <StarIcon className='w-5 h-5 fill-primary'/>
                      </div>
                      <p className="text-muted-foreground">This is an awesome product!</p>
                      </div>
                                      
                     
                      
                    
                  </div>             
            </div>

            {/* Write a Review */}
                <div className="mt-2 flex gap-2">
                     <Input placeholder="Write a review..."/>
                     <Button>Submit</Button>
                </div>
            </div>
            
          </div>

        </DialogContent>
    </Dialog>
      
    </>
  )
}

export default ProductDetailsContent
