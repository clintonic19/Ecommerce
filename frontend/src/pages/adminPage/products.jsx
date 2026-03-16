import React, { Fragment, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/sheet';
import CommonForm from '../../components/common/form';
import { addProductFormElements } from '../../config/config';
import UploadImage from '../../components/adminComponents/uploadImage';
import { useEffect,} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { addNewProduct, deleteProduct, fetchAllProducts, updateProducts } from '../../store/admin/products-slice/productSlice';
import { toast } from 'sonner';
import AdminProductTile from '../../components/adminComponents/productTile';


const initialFormData = {
    image: null,
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    salePrice: '',
    totalStock: '',
  };

const Products = () => {
  const [showCreateProduct, setShowCreateProduct] = useState(false)

  // Product form data state
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const[uploadImageUrl, setUploadImageUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const { productList } = useSelector((state) => state.adminProducts);
  const[currentProductId, setCurrentProductId] = useState(null);
  const dispatch = useDispatch();

  
  // form submit handler
  // const onSubmit = (e) =>{
  //   e.preventDefault();
  //   if (imageLoading) {
  //   alert("Please wait for image upload to finish");
  //   return;
  // }

  // if (!formData.image) {
  //   alert("Product image is required");
  //   return;
  // }
  //   console.log(formData);
  //   setFormData(initialFormData);
  // }

  const onSubmit=(event) =>{
    event.preventDefault();

    // Edit/update products
    currentProductId !== null ?
    dispatch(updateProducts({ 
      id: currentProductId, formData:formData
    })).then((data)=>{
      console.log("Product updated12 successfully::", data);
      if(data.payload.success){
        dispatch(fetchAllProducts());
        setFormData(initialFormData);
        setShowCreateProduct(false);        
        setCurrentProductId(null);
        toast.success(data?.payload?.message, { 
            variant: "success", 
            position: "top-right",
          });
      }else{
            toast.error(data?.payload?.message, { 
              variant: "destructive", 
              position: "top-right",
              });
            }
    }):

    //Add new product 
    dispatch(addNewProduct({
      ...formData,
      image: uploadImageUrl
    })).then((data) =>{
      if(data.payload.success){
        dispatch(fetchAllProducts());
        setShowCreateProduct(false);       
        imageFile && URL.revokeObjectURL(imageFile);
        // setImageFile(null);
        setFormData(initialFormData);
        // setShowCreateProduct(false);
        toast.success(data?.payload?.message, { 
          variant: "success", 
          position: "top-right",
        });
      }else{
        toast.error(data?.payload?.message, { 
          variant: "destructive", 
          position: "top-right",
       });
            }
    })
  };

  //DELETE product with id
  const deleteProductHandle =(currentProductId) =>{
    console.log("Delete product with id::", currentProductId);
    dispatch(deleteProduct(currentProductId)).then((data)=>{
      if(data.payload.success){
        dispatch(fetchAllProducts());
        toast.success(data?.payload?.message, { 
            variant: "success", 
            position: "top-right",
          });
      }else{
            toast.error(data?.payload?.message, { 
              variant: "destructive", 
              position: "top-right",
              });
            }
    })
  }

     

  // const isFormValid = Object.values(formData).every(value => value !== '' && value !== null);
  function isFormValid() {
    return Object.keys(formData)
      // .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  console.log("Form Data EDIT :::", formData, );
  
  useEffect(() => {
  dispatch(fetchAllProducts());
}, [dispatch]);

//   useEffect(() => {
//   if (uploadImageUrl) {
//     setFormData(prev => ({
//       ...prev,
//       image: uploadImageUrl
//     }));
//   }
// }, [uploadImageUrl]);

// console.log("Form Data :::", formData, );
// console.log("Product List:::",  productList);
// console.log("Upload Image URL:::",  uploadImageUrl);

  return <>
  <Fragment> 
    {/* Add products  button*/}
    <div className="mb-5 w-full flex justify-end bg-gre">
    <Button onClick={()=>{setShowCreateProduct(true)}} className='bg-green-700'> Add New Product </Button>
    </div>

      {/* Product Card display*/}
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {
          productList && productList.length > 0 ?
          productList?.map((product)=> (
          <AdminProductTile 
            key={product?._id} 
            product={product} 
            setCurrentProductId={setCurrentProductId}
            setShowCreateProduct={setShowCreateProduct}
            setFormData={setFormData}
            deleteProductHandle={deleteProductHandle}
           />
        )) : (
          <h1>No products available.</h1>
        )}
      </div>

      <Sheet 
            open={showCreateProduct} 
            onOpenChange={()=>{setShowCreateProduct(false)
              setCurrentProductId(null)
              setFormData(initialFormData)
              }}           
            >        
        <SheetContent side={'right'} className='overflow-auto'>       
          <SheetHeader>
            <SheetTitle> { currentProductId !== null ? "Update Product" : "Add New Product" }</SheetTitle>
          </SheetHeader> 

          {/* Product Image Upload */}
          <UploadImage 
          imageFile={imageFile} 
          setImageFile={setImageFile} 
          uploadImageUrl={uploadImageUrl} 
          setUploadImageUrl={setUploadImageUrl}
          setImageLoading={setImageLoading}
          imageLoading = {imageLoading}
          isEditMode={currentProductId !== null ? currentProductId : null}
          />

          {/* Product Form*/}
          <div className="py-6">
            {/* Product Form Here */}
            <CommonForm
              formControls={addProductFormElements}
              FormData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              buttonText = { currentProductId !== null ? "Update Product" : "Add Product"}
              // isBtnDisabled = {!isFormValid() || imageLoading}
            />
          </div>
        </SheetContent>    
      </Sheet>
    {/* </div> */}
  </Fragment>
  </>
}

export default Products
