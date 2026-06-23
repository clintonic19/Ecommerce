
import { Dialog, DialogContent } from '@/components/ui/dialog'
import React from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Avatar, AvatarFallback } from '../ui/avatar'


// handle ADD to Cart
const handleAddToCart = (productId, totalStock) => {}

const ProductDetailsContent = ({productDetails, open, setOpen}) => {
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
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
                  )
                }
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
                      <AvatarFallback>
                       SM
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Username</h3>
                      </div>

                      {/* comment/review rating */}
                      <div className="flex items-center gap-0.5">
                        {/* <StarRatingComponent  /> */}
                      </div>
                      <p className="text-muted-foreground">
                     
                      </p>
                    </div>
                  </div>
              
                
             
            </div>
            </div>
            
          </div>

        </DialogContent>
    </Dialog>
      
    </>
  )
}

export default ProductDetailsContent
