import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CommonForm from '../../components/common/form';
import { registerFormControls } from '../../config/config';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../store/auth-slice/authSlice';
import { toast } from 'sonner';



const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

// Register Page Component
const Register = () => {

  const [formData, setFormData] = useState(initialState); // State to hold form data
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  // form submit handler
  const onSubmit = (e) =>{
    e.preventDefault();
    dispatch(registerUser(formData)).then((data)=>{
      // navigate('/auth/login')
      if(data?.payload?.success) {
        navigate('/auth/login');
        toast.success(data?.payload?.message, { 
          variant: "success", 
          position: "top-right",
        });
       
      } else {
        toast.error("User already exist with this email", { 
          variant: "destructive", 
          position: "top-right",
        });
      }        
      // toast.success("Registration Successful");
    }).catch((error) => {
      console.log("Error in user registration:", error);
      toast.error("Registration Failed");
    });
    console.log("This is the submit button for FormDAta",formData)
  }



  return (
    <div className='mx-auto w-full max-w-md space-y-6  '>
      <div  className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'> Create New Account</h1>
      </div>

      <div className='flex flex-col gap-y-5'>
        <CommonForm
            formControls={registerFormControls}
            FormData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            buttonText = {"Create Account"}
        />
      </div>       
        {/* <p className='mt-4'>Already have an account? <Link className='text-red-700 font-medium hover:underline' to={'/auth/login'}>Login</Link> </p> */}       
        <div  className='text-center'>
        <span className='text-center text-sm text-gray-500 cursor-pointer '>
          Already have an account?
          <Link className='hover:text-red-700 hover:underline' to={'/auth/login'}> Login </Link>
          </span>
        </div>  
    </div>
  )
}

export default Register
