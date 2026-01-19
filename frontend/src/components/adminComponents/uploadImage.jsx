import React, { useRef } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { FileIcon, UploadCloudIcon, X, XIcon } from 'lucide-react';

const UploadImage = ({imageFile, setImageFile, uploadImageUrl, setUploadImageUrl}) => {
  const inputRef = useRef(null);

  // function to handle image file change
  const handleImagFileChange =(e) =>{
    e.preventDefault();
    console.log("File upload", e.target?.files);
    const file = e.target?.files?.[0];
    // const file = e.target.files?.[0];
    if(file) setImageFile(file); 
  };

  // function to handle drag over
  const handleDragOver = (e) =>{
    e.preventDefault();
    // const fileDragged = e.dataTransfer.files[0];
    // if(fileDragged) setImageFile(fileDragged);
  };

  // function to handle dropped over
   const handleDropOver = (e) =>{
    e.preventDefault();
    const fileDropped = e.dataTransfer?.files?.[0];
    if(fileDropped) setImageFile(fileDropped);
  };

  // function to handle remove image
  const handleRemoveImage = (e) =>{
    e.preventDefault();
    setImageFile(null); // Clear the selected image file
    if(inputRef.current){
      inputRef.current.value = '';
    }
  }


  return (
    <div className="w-full max-w-md mx-auto mt-5">
        <Label className="text-lg font-semibold mb-2 block">Upload Image:</Label>
        <div onDragOver={handleDragOver} onDrop={handleDropOver} className='border-2 border-dashed rounded-lg p-4'>
            <Input type="file"  id='uploadImage' 
            className='hidden' 
            ref={inputRef} 
            onChange={handleImagFileChange} />

            {/* Select an Image to upload function */}
            {
              !imageFile ?
              <Label htmlFor='fileUpload'
              className='flex flex-col items-center justify-center h-32 cursor-pointer'>
                <UploadCloudIcon className='w-10 h-10 mb-2 text-muted-foreground'/>
                <span className='text-sm text-center'>Drag and drop here or Click to select an image to upload</span>

              </Label> : <div className='flex items-center justify-center'>
                <div className='flex items-center justify-between'>
                  <FileIcon className='h-7 w-7 text-primary mr-2'/>
                  <p className='text-sm font-medium'>{imageFile?.name}</p>
                  <Button onClick={handleRemoveImage} variant='ghost' size='icon' className='text-muted-foreground hover:text-foreground'>
                    <XIcon className='w-4 h-4' />
                    <span className='sr-only'>Remove File</span>
                  </Button>
                </div>
              </div>
            }
        </div>

    </div>
  )
}

export default UploadImage

