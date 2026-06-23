import React, { useRef } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FileIcon, UploadCloudIcon, X, XIcon } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
import { Skeleton } from "../ui/skeleton";

const UploadImage = ({
  imageFile, 
  setImageFile,
   setImageLoading,
   imageLoading, 
   uploadImageUrl, 
   isEditMode,
   setUploadImageUrl }) => {
  const inputRef = useRef(null);

  // function to handle image file change/upload
  const handleImagFileChange =(e) =>{
    e.preventDefault();
    console.log("File upload:::", e.target?.files);
    const newFile = e.target.files?.[0];
    // const file = e.target.files?.[0];
    console.log("NEw File upload:::", newFile);
    if(newFile) setImageFile(newFile); 
  };
  
  // function to handle drag over
  const handleDragOver = (e) =>{
    e.preventDefault();
    const fileDragged = e.dataTransfer.files?.[0];
    if(fileDragged) setImageFile(fileDragged);
  };

  // function to handle dropped over
   const handleDropOver = (e) =>{
    e.preventDefault();
    const fileDropped = e.dataTransfer?.files?.[0];   
    console.log("fileDropped:::", fileDropped);
    if(fileDropped) setImageFile(fileDropped);
  };

  // function to handle remove image
  const handleRemoveImage = (e) =>{
    e.preventDefault();
    setImageFile(null); // Clear the selected image file
    if(inputRef.current){
      inputRef.current.value = '';
    }
  };
  
  const isUploadingRef = useRef(false);

  // async function uploadImageToCloudinary(){
  //   if (isUploadingRef.current) return; // 🚫 block duplicate
  //   if (!(imageFile instanceof File)) return;

  //   isUploadingRef.current = true;
  //   setImageLoading(true);

  //   try {
  //     const data = new FormData();
  //     data.append("file", imageFile);
  //     const response = await axios?.post('http://localhost:8001/api/admin/products/upload-image', data,);
  //     if(response?.data?.success){
  //       setUploadImageUrl(response?.data?.secure_url);
  //       setImageLoading(false);
  //     }
  //     const result = response?.data;
  //     console.log("This is the response from the server::", result);
  //   } catch (error) {
  //     console.log("Unable to upload image", error); 
  //     error.response?.data || error.message ? setUploadImageUrl(error.response?.data || error.message) 
  //     : setUploadImageUrl("Unable to upload image");     
  //   }

  // }
  
  
  
  
  //Function to upload image to cloudinary

  //Upload Image to Cloudinary
  async function uploadImageToCloudinary() {
  if (isUploadingRef.current) return;
  if (!(imageFile instanceof File)) return;

  isUploadingRef.current = true;

  try {
    setImageLoading(true);
    const data = new FormData();
    data.append("file", imageFile);

    const response = await axios?.post(
      "http://localhost:8001/api/admin/products/upload-image",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Server response:::", response.data);

    if (response.data?.success) {
      setUploadImageUrl(response.data.secure_url);
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error(
      "Unable to upload image",
      error.response?.data || error.message
    );
    setUploadImageUrl(null);
  } finally {
    isUploadingRef.current = false;   // ✅ ALWAYS reset
    setImageLoading(false);           // ✅ ALWAYS reset
  }
}

  useEffect(() => {
  if (!imageFile) return;
  if (!(imageFile instanceof File)) return;

  uploadImageToCloudinary();

}, [imageFile]);

  // useEffect(() =>{
  //   // Function to upload the image file to the server
  //   if(imageFile instanceof File){
  //   // if(imageFile !== null){
  //     uploadImageToCloudinary()
  //   }

  //   // if(!(imageFile instanceof File)) return;
  //   // if(uploadImageUrl) return;
  //   // uploadImageToCloudinary();

  // }, [imageFile]);


  return (
    <div className="w-full max-w-md mx-auto mt-5">
        <Label className="text-lg font-semibold mb-2 block">Upload Image:</Label>
        <div onDragOver={handleDragOver} onDrop={handleDropOver} className={ `${isEditMode ? 'opacity-50' : ''} border-2 border-dashed rounded-lg p-4`}>
            <Input 
            type="file"  
            id='fileUpload' 
            accept='image/*' 
            className='hidden' 
            ref={inputRef} 
            onChange={handleImagFileChange} 
            disabled={isEditMode}
            />

            {/* Select an Image to upload function */}
            { !imageFile ? (
              <Label htmlFor='fileUpload'
              className={`${isEditMode ? 'cursor-not-allowed':'cursor-pointer'} flex flex-col items-center justify-center h-32 cursor-pointer`}>
                <UploadCloudIcon className='w-10 h-10 mb-2 text-muted-foreground'/>
                <span className='text-sm text-center'>Drag and drop here or Click to select an image to upload</span>
              </Label>
              ) : ( 
                imageLoading ?
                <Skeleton className='h-10 bg-gray-100'/> : 
                
              <div className='flex items-center justify-center'>
                <div className='flex items-center justify-between'>
                  <FileIcon className='h-7 w-7 text-primary mr-2'/>
                  <p className='text-sm font-medium'>{imageFile?.name}</p>
                  <Button onClick={handleRemoveImage} variant='ghost' size='icon' className='text-muted-foreground hover:text-foreground'>
                    <XIcon className='w-4 h-4' />
                    <span className='sr-only'>Remove File</span>
                  </Button>
                </div>
              </div>     
           ) }

        </div>

    </div>
  )
}

export default UploadImage

