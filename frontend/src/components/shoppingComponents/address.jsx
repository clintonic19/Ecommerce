import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "../../config/config";
// import { useState } from 'react';
import CommonForm from '../common/form';
import { useDispatch, useSelector } from 'react-redux'
import { addAddress, deleteAddress, fetchAddress, updateAddress } from '../../store/address-slice/addressSlice';
import { toast } from 'sonner'
import { useEffect, useState } from 'react';
import AddressCard from './address-card';



const initialAddressFormData = {
  address: "",
//   state: "",
  city: "",
  phoneNo: "",
  zipCode: "",
  notes: "",
};

const Address = ({setCurrentSelectedAddress}) => {
    const [formData, setFormData] = useState(initialAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const { addressList } = useSelector((state) => state.shopAddressSlice);
    const dispatch = useDispatch();


    // function to submit form address data
    const handleAddressFormSubmit = (e) =>{
        e.preventDefault();

        {
          if(addressList.length >= 4 && currentEditedId === null){ // Check if the user is trying to add a new address when they already have 4 addresses
            setFormData(initialAddressFormData);
            setCurrentEditedId(null);
            toast.error("You can only add up to 4 addresses.", {
              variant: "destructive",
              position: "top-right",
            });
            return;
          }
        }

        // Update Address
            currentEditedId !== null ?
            dispatch(updateAddress({ 
              userId: user?._id,
              addressId: currentEditedId,
              formData:formData
            })).then((data)=>{
              if(data.payload.success){
                dispatch(fetchAddress(user?._id));
                setCurrentEditedId(null);
                setFormData(initialAddressFormData);
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

        //Add new Address
        dispatch(addAddress({ 
            ...formData,  
            userId: user?._id, 
        })
    ).then((data) => {
        console.log(data);
        if(data?.payload?.success){
          dispatch(fetchAddress(user?._id));
          setFormData(initialAddressFormData);
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
          )};
       }); 
    };

    //Edit address with id
    const handleEditAddress = (addressInfo) => {
        console.log("Edit Address:: ", addressInfo);
        
        setCurrentEditedId(addressInfo._id);
        setFormData({
            ...formData,
            address: addressInfo?.address,
            city: addressInfo?.city,
            phoneNo: addressInfo?.phoneNo,
            zipCode: addressInfo?.zipCode,
            notes: addressInfo?.notes,
        });
    }

     //DELETE address with id
      const handleDeleteAddress =(currentEditedId) =>{
        console.log("Delete address with id::", currentEditedId);
        dispatch(deleteAddress({ userId: user?._id, addressId: currentEditedId })).then((data)=>{
          if(data?.payload?.success){
            dispatch(fetchAddress( user?._id,));
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

    //   const isFormValid = Object.values(formData).every(value => value !== '' && value !== null);

  function isFormValid() {
    return Object.keys(formData)
      // .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key]?.trim() !== "")
      .every((item) => item);
  }

  useEffect(()=>{
    dispatch(fetchAddress(user?._id));
  },[dispatch])


  return (
    <>
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
              key={singleAddressItem}
                // selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "UPDATE ADDRESS" : "ADD NEW ADDRESS "}
        </CardTitle>
      </CardHeader>

      {/* Content to hold form data */}
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          FormData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "UPDATE" : "ADD"}
          onSubmit={handleAddressFormSubmit}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
      
    </>
  )
}

export default Address
