import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card';

const AdminProductTile = ({product, setFormData, setCurrentProductId, setShowCreateProduct, deleteProductHandle }) => {
  return (
    <Card className='w-full max-w-sm mx-auto'>
        <div>
            <div className='relative w-full h-30'>
                <img 
                    src={product?.image} 
                    alt={product?.title} 
                    className='w-full h-[300px] rounded-t-lg object-cover' />
            </div>
            <CardContent>
                <h3 className='text-lg font-semibold mb-2 mt-8'>{product?.title}</h3>
                <p className='text-sm text-muted-foreground mb-4'>{product?.description}</p>
                <div className='flex items-center justify-between mb-2'>
                    <span className='text-green-600 font-bold text-lg'>${product?.salePrice || product?.price}</span>
                   
                    {/* Sale price indicator */}
                    {product?.salePrice && 
                        <span className='text-sm text-muted-foreground line-through'>${product?.price}</span>
                    }

                    {/* {
                        product.salePrice > 0 ? (
                            <span className='text-sm text-muted-foreground line-through'>${product?.price}</span>
                        ) : null
                    }  */}
                </div>
            </CardContent>

            {/* Edit and Delete buttons for ADMIN */}
            <CardFooter className='flex justify-between items-center'>
                {/* Edit product button */}
                <button 
                onClick={()=>{
                    setShowCreateProduct(true);
                    setCurrentProductId(product?._id);
                    setFormData(product);
                }}
                className='px-4 py-2 bg-gray-700 text-white rounded hover:bg-green-800 transition'>Edit</button>                
                
                {/* Delete Product button */}
                <button 
                onClick={() => deleteProductHandle(product?._id)}
                className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition'>Delete</button>
            </CardFooter>
        </div>  
    </Card>
  )
}

export default AdminProductTile
