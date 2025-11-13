import axios from "axios";

const LoginUser = async (email, password) => {
    try {
        // Login user logic here
        const payload = {
            email: email,
            password: password,
        };
        console.log("1");
        const response = await axios.post(`http://10.0.2.2:4000/api/user/login`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    }
    catch (error) {
        console.error("Login failed in auth.js", error);

    }
};
export { LoginUser };