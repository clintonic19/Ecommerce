import React from 'react'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'

const ProductTileShoppingView = ({product}) => {
  return (
    <>
            <Card className='w-full max-w-sm max-auto'>
               <div>
                    <div className="relative">
                        <img 
                        src={product?.image}
                        alt={product?.title}
                        className='w-full h-[300px] object-cover rounded-t-lg'
                        />
                        {
                            product?.salePrice > 0 ?(
                           <Badge className='absolute top-2 right-2 bg-red-600 hover:bg-red-700' 
                                  variant="default | outline | secondary | destructive">
                                Sale
                            </Badge>
                            ) : null
                        }                        
                    </div>

                    {/* Card content */}
                    <CardContent className="p-4">
                      <h2 className='mb-2 text-xl font-semibold'>{product?.title}</h2>
                      <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm text-muted-foreground'>{product?.category}</span>
                        {/* <span className='text-sm text-muted-foreground'>{product?.category}</span> */}
                        <span className='text-sm text-muted-foreground'>{product?.brand}</span>
                      </div>

                      <div className='flex justify-between items-center mb-2'>
                        <span className={`${product?.salePrice > 0 ? 'line-through' : ""} text-lg font-semibold text-primary`}>{product?.price}</span>
                        {/* <span className={`${product?.salePrice > 0 ? 'line-through' : ""} text-sm text-muted-foreground`}>{product?.price}</span> */}
                        {
                          product?.salePrice > 0 ? (
                            <span className='text-lg font-semibold text-primary'>${product?.salePrice?.toFixed(2)}</span>
                          ) : null
                        }                        
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button className='w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors duration-300'>
                        Add to Cart
                      </Button>
                    </CardFooter>
               </div>
      
        </Card>
    </>
  )
}

export default ProductTileShoppingView
