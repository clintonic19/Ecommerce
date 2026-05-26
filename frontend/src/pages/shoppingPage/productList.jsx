import React, { useEffect } from 'react'
import ShoppingHeader from '../../components/shoppingComponents/shoppingHeader'
import Filter from '../../components/shoppingComponents/filter'
import {DropdownMenu, DropdownMenuRadioItem, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'
import { Button } from '../../components/ui/button'
import { ArrowUpDownIcon } from 'lucide-react'
import { sortOptions } from '../../config/config'
import { useDispatch, useSelector } from 'react-redux'
import { filterAllProducts } from '../../store/shoppingView/productShoppingViewSlice'
import ProductTileShoppingView from './ProductTileShoppingView'

const ProductList = () => {
  const dispatch = useDispatch();
  const {productList} = useSelector((state) => state.shoppingViewProducts);

  // FETCH ALL PRODUCTS FROM API
  useEffect(()=>{
    dispatch(filterAllProducts());
    console.log("Filter::: Products filtered successfully");
  },[dispatch])

  console.log("Product List:::", productList);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
        <Filter/>
        {/* Right side to display products items */}
        <div className="bg-background w-full shadow-sm rounded-lg">
          <div className="border-b p-4 justify-between flex items-center">
            <h2 className='text-lg font-semibold'>All Products</h2>
            <div className="flex items-center gap-4"> 
              <span className="text-sm text-muted-foreground">10 Products</span>
               {/* Dropdown for sorting */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant='outline' size='sm' className='flex items-center gap-2'>
                  <ArrowUpDownIcon className='h-4 w-4'/>
                    <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[200px]'>
                <DropdownMenuRadioGroup>
                  {
                    sortOptions.map((option) => (
                      <DropdownMenuRadioItem key={option.id} onSelect={() => console.log("Sort option ID::", option.id)}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))
                  }
                </DropdownMenuRadioGroup>

              </DropdownMenuContent>
            </DropdownMenu>
            </div>         
          </div>
          {/* Product items will be displayed here */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {
              productList && productList?.length > 0 ? (
                productList?.map((product) => (
                  <ProductTileShoppingView key={product?._id} product={product}/>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <h3 className="text-lg font-semibold">No products found.</h3>
                </div>
              )              
            }

          </div>
        </div>
      </div>
    </>
  )
}

export default ProductList
