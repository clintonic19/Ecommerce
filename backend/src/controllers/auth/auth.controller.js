const { hashPassword, comparePassword, generateToken } = require ("../../utils/password.encrypt");
const User = require ("../../models/User.model.js");

//Register user
const registerUser = async(req, res) =>{
    try {
        const { firstName, lastName, email, password } = req.body;
        
        // Check if all required fields are provided
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        };

         // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
        };

          //check for password strength
        if(password.length < 6){
            return res.status(400).json({ 
                success: false,
                message: "Password must be at least 6 characters long" 
            });
        };

         // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist with this email"
             });
        };

        // Hash the password
        const securedPassword = await hashPassword(password);
        if (!securedPassword) {
            return res.status(500).json({
                success: false,
                message: "Error hashing password"
            });
        };
        
        // Create new user
        const newUser = new User({ 
            firstName,
            lastName,
            email, 
            password: securedPassword
        });

         // Respond with success message
        // Note: Do not send the password back in the response
        if(newUser){
            //generate JWT token
            generateToken(newUser._id, res);
        };

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({
            success: true,
             message: "Registration successful",
             newUser,
             password: newUser.password = undefined
            });

    } catch (error) {
        console.error("Error in user registration:", error.message);
        res.status(500).json({
            success: false,
             message: "Server error during registration" 
            });     
    };

}


//Login user
const loginUser = async(req, res) =>{
      try {
        const { email, password } = req.body;

        // Validate input
        if ( !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };

        //check for password strength
        if(password.length < 6){
            return res.status(400).json({ 
                message: "Password must be at least 6 characters long" 
            });
        };

        // Find the user by email
        const user = await User.findOne({ email })

         if (!user) {
            return res.status(400).json({
                status: "false", 
                message: "Invalid email and password"
             });
        };

        // Compare the provided password with the stored hashed password
        // Using the comparePassword function to check if the password matches
        const isPasswordMatch = await comparePassword(password, user?.password); // Compare the password with the hashed password

         if (!isPasswordMatch) {
            return res.status(401).json({
                status: "false",
                message: "Invalid email and password"
            });
        };

        const token = generateToken(user._id, res); // Generate JWT token for the user

        // Respond with success message
        // res.status(200).json({ 
        //     status: true,
        //     message: "LogIn successful",
        //     user: {
        //         _id: user._id,
        //         firstName: user.firstName,
        //         lastName: user.lastName,
        //         email: user.email,
        //         role: user.role
        //     },
        //     token: token // Send the token in the response
        // });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        }).json({
            success: true,
            message: "Login successful",
            user:{
                id: user._id,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            token: token // Send the token in the response
        });

    } catch (error) {
         console.error("Error in login user:", error.message);
        res.status(500).json({ 
            status: false, 
            message: "Internal server error" 
        });        
    }
}


//Logout user
const logoutUser = async(req, res) =>{
      try {
        res.clearCookie('token').json({
            success: true,
            message: "Logout successful"
        })
        
    } catch (error) {
        console.error("Error in logout user:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}