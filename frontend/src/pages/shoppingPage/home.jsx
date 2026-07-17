import React from 'react'
import ShoppingHeader from '../../components/shoppingComponents/shoppingHeader';
import frontPageImage1 from '../../assets/frontPageImage1.png'
import frontPageImage2 from '../../assets/frontPageImage2.png'
import frontPageImage3 from '../../assets/frontPageImage3.webp'
import { Button } from '../../components/ui/button';
import { Airplay, BabyIcon, ChevronLeftIcon, ChevronRightIcon, 
  CloudLightning, Heater, Images, Shirt, ShirtIcon, ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon } from 'lucide-react';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from '../../components/ui/card';
import { fetchProductDetails, filterAllProducts } from '../../store/shoppingView/productShoppingViewSlice';
import ProductTileShoppingView from '../../components/shoppingComponents/ProductTileShoppingView';
import { addToCart, fetchCartItems } from '../../store/cart-slice/cartSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ProductDetailsContent from '../../components/shoppingComponents/productDetails';

  const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

const Home = () => {
  const slides = [frontPageImage1, frontPageImage2, frontPageImage3 ];
  const[ currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector((state) => state.shoppingViewProducts);
  const {user} = useSelector(state=>state.auth)
  const [openProductDetails, setOpenProductDetails] = useState(false);
  const navigate = useNavigate();
  
  

  const dispatch = useDispatch();


 useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

   useEffect(() => {
    dispatch(filterAllProducts({ filterParams : {}, sortParams : "price-lowtohigh" }))
  }, [dispatch]);

 const handleNavigateToListingPage = (getCurrentItem, section) => {
  sessionStorage.removeItem("productFilters")
  const currentFilter = {
    [section]: [getCurrentItem.id],
  };
  sessionStorage.setItem("productFilters", JSON.stringify(currentFilter));
  navigate(`/shop/list`)
};

 // Handle product details click
  const handleProductDetails = (currentProductId) =>{
    dispatch(fetchProductDetails(currentProductId));
  }

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
};

   // Fetch product details when productDetails state changes
useEffect(() => {
      if (productDetails !== null) {
        setOpenProductDetails(true);
      }
    }, [productDetails]);
  

  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <div className="relative w-full h-[600px] overflow-hidden">
          {
            slides.map((slides, item ) => <img src ={slides} key={item}
            className={`${item === currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            />)
          }
          <Button
          variant="outline"
          size="icon"
          onClick={()=>setCurrentSlide((prevSlide)=>(prevSlide - 1 + slides.length) % slides.length)}
           className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
          > <ChevronLeftIcon className="w-4 h-4" /> 
          </Button>

          <Button
          variant="outline"
          size="icon"
          onClick={()=>setCurrentSlide((prevSlide)=>(prevSlide + 1) % slides.length)}

           className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
          >  <ChevronRightIcon className="w-4 h-4" /> 
          </Button>
        </div>

        
    {/* Seesion category */}

    <section className='py-12 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-8'> Category </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Mapping category */}
            {categoriesWithIcon.map((categoryItem) => (
              <Card
              key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
      </div>
    </section>

    {/* session for brand */}
    <section className='py-12 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-8'> Brands </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Mapping category */}
            {brandsWithIcon.map((brandItem) => (
              <Card
              key={brandItem.id}
                onClick={() =>
                  handleNavigateToListingPage(brandItem, "brand")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
      </div>
    </section>

    {/* Section to map productList */}
    <section className='py-12'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-8'> Feature Products </h2>
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {
            productList && productList?.length > 0 ?
            productList?.map((productItem )=>(
                <ProductTileShoppingView 
                  handleProductDetails={handleProductDetails} 
                  key={productItem?._id} 
                  product={productItem}
                  handleAddToCart={handleAddToCart}
                />
                )) : null
          }
         </div>
    </section>
    {/* open product details dialog */}
     <ProductDetailsContent 
        open={openProductDetails} 
        setOpen={setOpenProductDetails} 
        productDetails={productDetails} 
        />
    </div>


    </>
  )
}

export default Home;
