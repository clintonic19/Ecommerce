import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {

    

    //   const handleDeleteAddress = (addressInfo) => {
    //     console.log("Edit Address Info::", addressInfo);
    // }

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
    //   className={`cursor-pointer border-red-700 ${
    //     selectedId?._id === addressInfo?._id
    //       ? "border-red-900 border-[4px]"
    //       : "border-black"
    //   }`}
    >
      <CardContent className="grid p-5 gap-4">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>zipCode: {addressInfo?.zipCode}</Label>
        <Label>Phone No: {addressInfo?.phoneNo}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>

      <CardFooter className="p-3 flex justify-between">

        {/* EDIT ADDRESS */}
        <Button 
        onClick={() => handleEditAddress(addressInfo)}
        className='px-4 py-2 bg-gray-700 text-white rounded hover:bg-green-800 transition'>
            Edit
        </Button>
        
        {/* DELETE ADDRESS */}
        <Button 
        onClick={() => handleDeleteAddress(addressInfo._id)}
        className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition'>
            Delete
        </Button>
      </CardFooter>
      
    </Card>
  );
}

export default AddressCard;