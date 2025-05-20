import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        birthDate: "",
        phone: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (value) => {
        setFormData({ ...formData, phone: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, provider: "email" };
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log("User Registered:", response.data);
            navigate("/home");
        } catch (error) {
            console.error("Registration error:", error.response ? error.response.data : error.message);
        }
    };
    

    const handleGoogleSignUp = () => {
        window.location.href = "http://localhost:5000/api/auth/google";
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
            <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-96 border border-purple-600">
                <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">Create an Account</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        required
                    />
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        required
                    />
                    <PhoneInput
                        country={"tn"}
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        inputProps={{ required: true }}
                        containerStyle={{
                            width: '100%',
                            marginBottom: '1rem',
                        }}
                    />

                    <button
                        type="submit"
                        className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Google Sign Up */}
                <button
                    onClick={handleGoogleSignUp}
                    className="w-full mt-4 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition duration-300"
                >
                    <img
                        src="https://img.icons8.com/color/24/google-logo.png"
                        alt="Google"
                        className="mr-2"
                    />
                    Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="w-full h-px bg-gray-700"></div>
                    <p className="px-3 text-gray-400">OR</p>
                    <div className="w-full h-px bg-gray-700"></div>
                </div>

                {/* Already have an account? */}
                <p className="text-center text-gray-400">
                    Already have an account?{" "}
                    <button className="text-purple-400 hover:underline" onClick={() => navigate("/")}>
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
