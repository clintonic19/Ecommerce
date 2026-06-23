
import React, { useState } from 'react'
import { loginFormControls } from '../../config/config'
import CommonForm from '../../components/common/form';
import { Link } from 'react-router-dom';
import Button from '../../components/button';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/auth-slice/authSlice';
import { toast } from 'sonner';
import {  FaGooglePlusG } from "react-icons/fa";  
import { useAuth } from '../../reactContext/authContext';


const initialState = {
  email: '',
  password: '',
};

const Login = () => {
  const [formData, setFormData] = useState(initialState);
  // const { signUpWithGoogle } = useAuth();
  const dispatch = useDispatch();

    
  // form submit handler
  const onSubmit = (e) =>{
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) =>{
      if(data?.payload?.success){
        toast.success(data?.payload?.message, { 
          variant: "success", 
          position: "top-right",
        });
      }else{
        toast.error("Invalid email and password", { 
                  variant: "destructive", 
                  position: "top-right",
                });
      }
      console.log("This is the login response data", data);
    });
    // console.log(formData);
  }

  //   GOOGLE SIGN IN
     const handleGoogleSignIn = async () => {
        try {
            const user = await signUpWithGoogle();
            alert('User Logged In Successfully', user);
        } catch (error) {
            console.log(error);
            // setMessage('Unable to Sign In With Google Auth');
        }
      }

  return (
    <div className='mx-auto w-full max-w-md space-y-6  '>
      <div  className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'> Login</h1>
      </div>

        <div className='flex flex-col gap-y-5'>


      <CommonForm
          formControls={loginFormControls}
          FormData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          buttonText = "Login"
      />
      </div>
        {/* <p className='mt-4'>Already have an account? <Link className='text-red-700 font-medium hover:underline' to={'/auth/login'}>Login</Link> </p> */}
        
        <div  className='text-center'>
        <span className='text-center text-sm text-gray-500 cursor-pointer '>
          Don't have an account?
          <Link className='hover:text-red-700 hover:underline' to={'/auth/register'}> Register </Link>
          </span>

            {/* google sign in */}
                    <div className='mt-4'>
                        <button 
                           onClick={handleGoogleSignIn}
                        className='w-full flex flex-wrap gap-1 items-center justify-center bg-primary text-white font-bold py-2 px-4 rounded-md focus:outline-none'>
                        <FaGooglePlusG  className='mr-2'/>
                            Sign in with Google
                        </button>
                    </div>
        </div>
    
    </div>
  )
}

export default Login
