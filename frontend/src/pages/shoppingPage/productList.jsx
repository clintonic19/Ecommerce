import React, { useEffect } from 'react'
import ShoppingHeader from '../../components/shoppingComponents/shoppingHeader'
import Filter from '../../components/shoppingComponents/filter'
import {DropdownMenu, DropdownMenuRadioItem, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'
import { Button } from '../../components/ui/button'
import { ArrowUpDownIcon } from 'lucide-react'
import { sortOptions } from '../../config/config'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetails, filterAllProducts } from '../../store/shoppingView/productShoppingViewSlice'
import ProductTileShoppingView from '../../components/shoppingComponents/ProductTileShoppingView'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductDetailsContent from '../../components/shoppingComponents/productDetails.jsx'
import { addToCart, fetchCartItems } from '../../store/cart-slice/cartSlice.js'
import { toast } from 'sonner'

const ProductList = () => {
  const dispatch = useDispatch();
  const {productList, productDetails} = useSelector((state) => state.shoppingViewProducts);
  // const [filters, setFilters] = useState(null);
  const [filters, setFilters] = useState(() => {
  const stored = sessionStorage.getItem("productFilters");
  return stored ? JSON.parse(stored) : {};
});
  const {user} = useSelector(state=>state.auth)
  const [sortBy, setSortBy] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openProductDetails, setOpenProductDetails] = useState(false);

  // Helper function to create search params from filters
  const createSearchParamsHelper = (filterParams) =>{
     const queryParams = []; // Initialize an array to hold individual query parameters

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`); // Encode the parameter value to handle special characters
    }
  }
  return queryParams.join("&");

  }

  // Handle SortBy Option change
  const handleSortBy = (value) =>{
    setSortBy(value); 
  }

  // Handle filter option change
  const handleFilterOptions = (sectionFilterId, currentFilter) => {
  let updatedFilters = filters ? { ...filters } : {};

  const indexOfCurrentFilter = Object.keys(updatedFilters).indexOf(sectionFilterId);

  if (indexOfCurrentFilter === -1) {
    // sectionFilterId doesn't exist yet — create it with currentFilter as first item
    updatedFilters = { ...updatedFilters, [sectionFilterId]: [currentFilter] };
  } else {
    const currentFiltersArray = [...updatedFilters[sectionFilterId]]; // copy to avoid direct mutation
    const indexOfCurrentFilterInArray = currentFiltersArray.indexOf(currentFilter);

    if (indexOfCurrentFilterInArray === -1) {
      // Filter not present — add it
      currentFiltersArray.push(currentFilter); // ✅ Fix: push into the copied array, not a new one
    } else {
      // Filter already present — remove it
      currentFiltersArray.splice(indexOfCurrentFilterInArray, 1);
    }

    updatedFilters = { ...updatedFilters, [sectionFilterId]: currentFiltersArray };
  }
  setFilters(updatedFilters);// Update the state with the new filters
  sessionStorage.setItem("productFilters", JSON.stringify(updatedFilters));
};

// handle ADD product to CART
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
}


  // FETCH ALL PRODUCTS FROM API
  useEffect(()=>{
    if(filters !== null && sortBy !== null)
      dispatch(filterAllProducts({filterParams : filters, sortParams : sortBy}));
  },[dispatch, sortBy, filters]);

  // Search params change effect to update filters state
   useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  // Set filters from session storage on component mount
  useEffect(()=>{
    setSortBy("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("productFilters")) || {});
  },[])

  // Handle product details click
  const handleProductDetails = (currentProductId) =>{
    dispatch(fetchProductDetails(currentProductId));
  }

  // Fetch product details when productDetails state changes
  useEffect(() => {
    if (productDetails !== null) {
      setOpenProductDetails(true);
    }
  }, [productDetails]);

  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
{/* Filter sidebar */}
        <Filter filters={filters} handleFilterOptions={handleFilterOptions}/>

        {/* Right side to display products items */}
        <div className="bg-background w-full shadow-sm rounded-lg">
          <div className="border-b p-4 justify-between flex items-center">
            <h2 className='text-lg font-extrabold'>All Products</h2>
            <div className="flex items-center gap-4"> 
              <span className="text-sm text-muted-foreground">{productList?.length || 0} Products</span>
               
               {/* Dropdown for sorting */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild >
                <Button variant='outline' size='sm' className='flex items-center gap-2'>
                  <ArrowUpDownIcon className='h-4 w-4'/>
                    <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[200px]'>

                {/* Sort options */}
                <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSortBy} >
                  {
                    sortOptions.map((option) => (
                      <DropdownMenuRadioItem key={option?.id} value={option?.id} >
                        {option?.label}
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
                  <ProductTileShoppingView 
                  handleProductDetails={handleProductDetails} 
                  key={product?._id} 
                  product={product}
                  handleAddToCart={handleAddToCart}
                />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <h3 className="text-lg font-semibold">No products found.</h3>
                </div>
              )              
            }
          </div>
        </div>

        {/* Product Details Dialog */}
        <ProductDetailsContent 
        open={openProductDetails} 
        setOpen={setOpenProductDetails} 
        productDetails={productDetails} 
        />
      </div>
    </>
  )
}

export default ProductList
