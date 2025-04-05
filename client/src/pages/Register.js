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
            const response = await axios.post("http://localhost:3000/register", formData);
            console.log("User Registered:", response.data);
            navigate("/home"); // Redirige après un enregistrement réussi
        } catch (error) {
            console.error("Registration error:", error.response ? error.response.data : error.message);
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
            <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-96 border border-purple-600">
                <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">Create an Account</h2>

                {/* Formulaire */}
                < form onSubmit={handleSubmit}>
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

                    {/* Champ téléphone avec drapeau */}
                    <PhoneInput
  country={"tn"}
  value={formData.phone}
  onChange={handlePhoneChange}
  inputProps={{
    required: true,
  }}
  containerStyle={{
    width: '100%',
    marginBottom: '1rem',
  }}
/>

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="w-full h-px bg-gray-700"></div>
                    <p className="px-3 text-gray-400">OR</p>
                    <div className="w-full h-px bg-gray-700"></div>
                </div>

                {/* Déjà inscrit ? */}
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





