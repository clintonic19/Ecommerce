// import useAuth from "./useAuth";
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';

import {  createUserWithEmailAndPassword, signInWithEmailAndPassword, 
        GoogleAuthProvider, signInWithPopup, signOut, 
        onAuthStateChanged} from 'firebase/auth';

import { auth } from '../firebase/firebase';

//AUTH CONTEXT
const AuthContext = createContext();

export const useAuth = () => { 
    return useContext(AuthContext) 
};

// const auth = getAuth();

//GOOGLE PROVIDER
const provider = new GoogleAuthProvider();

//AUTH PROVIDER
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //SIGN UP / REGISTER FUNCTION
    const signUpUser = async (email, password) =>{
        return await createUserWithEmailAndPassword(auth, email, password)

    }

    //LOGIN FUNCTION
    const signInUser = async (email, password) =>{
        return await  signInWithEmailAndPassword(auth, email, password)
    }

    // Sign up With Google Auth
    const signUpWithGoogle = async () => {
       return await signInWithPopup(auth, provider)

    }
    
    //LOGOUT FUNCTION
    const logout = () => {
        return signOut(auth);
    }

    //MANAGING USER STATE ON AUTH CHANGE
    const user = auth.currentUser; 
    useEffect(()=>{
        const unsubscribeUser = onAuthStateChanged(auth, (user) =>{
            setCurrentUser(user);
            setLoading(false);
        });

        if( user !== null ){
            const { email, displayName, photoURL } = user;

            const user = {
                email, username: displayName, photoURL
            }
        }

        return () => unsubscribeUser();
    }, [])
   
    const value = { currentUser, loading, signUpUser, signInUser, signUpWithGoogle, logout }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
  };

//props validations here
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};