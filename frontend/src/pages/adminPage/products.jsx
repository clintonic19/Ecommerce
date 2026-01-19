import React, { Fragment, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/sheet';
import CommonForm from '../../components/common/form';
import { addProductFormElements } from '../../config/config';
import UploadImage from '../../components/adminComponents/uploadImage';

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

  
  // form submit handler
  const onSubmit = (e) =>{
    e.preventDefault();
    console.log(formData);
    setFormData(initialFormData);
  }
  
  return <>
  <Fragment>
    
    <div className="mb-5 w-full flex justify-end bg-gre">
    <Button onClick={()=>{setShowCreateProduct(true)}} className='bg-green-700'> Add New Product </Button>
    </div>

    {/* Add products */}
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      {/* Product Card */}
      <Sheet open={showCreateProduct} onOpenChange={()=>{setShowCreateProduct(false)}}>
        
        <SheetContent side={'right'} className='overflow-auto'>
          
          <SheetHeader>
            
            <SheetTitle> Add New Product</SheetTitle>
          </SheetHeader> 
          <UploadImage file={imageFile} setImageFile={setImageFile} url={uploadImageUrl} setUrl={setUploadImageUrl}/>

          {/* Product Form*/}
          <div className="py-6">
            {/* Product Form Here */}
            <CommonForm
              formControls={addProductFormElements}
              FormData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              buttonText = { "Add Product"}
            />
          </div>
        </SheetContent>    
      </Sheet>
    </div>
  </Fragment>
  </>
}

export default Products
