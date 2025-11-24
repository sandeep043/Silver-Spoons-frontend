import axios from "axios";

const LoginUser = async (email, password) => {
    try {
        // Login user logic here
        const payload = {
            email: email,
            password: password,
        };

        const response = await axios.post(`http://10.0.2.2:4000/api/user/login`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });


        return response.data;
    }
    catch (error) {
        console.error("Login failed in auth.js", error.response?.data || error.message || error);

    }
};


const SignUpUser = async (fullName, email, phoneNumber, password) => {
    try {
        // Sign up user logic here
        const payload = {
            name: fullName,
            email: email,
            phone: phoneNumber,
            password: password,
        };

        const response = await axios.post(`http://10.0.2.2:4000/api/user/signup`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // return the server response so caller can act on success
        return response.data;

    }
    catch (error) {
        console.error("Sign up failed in auth.js", error.response?.data || error.message || error);


    }


}

const VerifyOTPUser = async (email, otp) => {
    try {
        // Verify OTP logic here    
        const payload = {
            email: email,
            otp: otp,
        };
        const response = await axios.post(`http://10.0.2.2:4000/api/user/verify-otp`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("OTP verification failed in auth.js", error.response?.data || error.message || error);

    }
}

const ResendOTPUser = async (email) => {
    try {
        // Resend OTP logic here
        const payload = {
            email: email,
        };
        const response = await axios.post(`http://10.0.2.2:4000/api/user/resend-otp`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Resend OTP failed in auth.js", error.response?.data || error.message || error);

    }
}



export { LoginUser, SignUpUser, VerifyOTPUser, ResendOTPUser };