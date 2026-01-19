
import React, { useState } from 'react'
import { loginFormControls } from '../../config/config'
import CommonForm from '../../components/common/form';
import { Link } from 'react-router-dom';
import Button from '../../components/button';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/auth-slice/authSlice';
import { toast } from 'sonner';



const initialState = {
  email: '',
  password: '',
};

const Login = () => {
  const [formData, setFormData] = useState(initialState);
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
    console.log(formData);
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
        </div>
    
    </div>
  )
}

export default Login
