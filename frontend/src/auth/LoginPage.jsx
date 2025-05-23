import { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import Logo from '../assets/logo.png';
import Illus1 from '../assets/home/login.png';

const LoginPage = () => {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Minimum 8 characters required';
        } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
            newErrors.password = 'Use both uppercase and lowercase letters';
        }

        if (!isLogin && !businessName.trim()) {
            newErrors.businessName = 'Business Name is required';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            setErrors({});
            const endpoint = isLogin ? "/api/users/login" : "/api/users/signup";
            const payload = isLogin
                ? { email, password }
                : { name: businessName, email, password };

            try {
                const res = await fetch(`https://invmanage-v22c.onrender.com${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const data = await res.json();

                if (res.ok) {
                    // Save userId in cookies
                    const userId = isLogin ? data.user.id : data.userId;
                    Cookies.set("userId", userId, { expires: 7 });

                    Swal.fire({
                        icon: 'success',
                        title: data.message,
                        text: isLogin ? 'Welcome back!' : 'Account created successfully!',
                        confirmButtonColor: '#F8486E',
                    }).then(() => {
                        navigate("/");
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops!',
                        text: data.message,
                        confirmButtonColor: '#F8486E',
                    });
                }
            } catch (error) {
                console.error("API Error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Something went wrong',
                    text: 'Please try again later.',
                    confirmButtonColor: '#F8486E',
                });
            }

            // Reset form
            setBusinessName('');
            setEmail('');
            setPassword('');
        } else {
            setErrors(validationErrors);
        }
    };


    return (
        <div className="min-h-screen w-full flex items-center justify-center px-2 md:px-4 overflow-hidden">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row border border-gray-300 overflow-hidden">
                <div className="hidden md:flex w-10/12 items-center justify-center p-6">
                    <img src={Illus1} alt="Illustration" className="max-h-[400px] w-auto object-contain" />
                </div>
                <div className="w-full md:w-1/2 p-6 md:p-10 space-y-6">
                    <div className="flex justify-center">
                        <img src={Logo} alt="Logo" className="h-20 w-20 object-contain" />
                    </div>

                    <motion.h2
                        className="text-center text-2xl font-bold text-[#F8486E]"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {isLogin ? 'Login to Your Account' : 'Create Your Account'}
                    </motion.h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-800">Business Name</label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder="Enter your business name"
                                    className={`w-full px-4 py-2 rounded-xl border ${errors.businessName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#F8486E]`}
                                />
                                {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-800">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className={`w-full px-4 py-2 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#F8486E]`}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-800">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className={`w-full px-4 py-2 pr-16 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#F8486E]`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-sm text-[#F8486E] font-medium focus:outline-none"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        <motion.button
                            type="submit"
                            className="w-full bg-[#F8486E] text-white py-3 rounded-full text-lg font-semibold hover:bg-[#e43c63] transition duration-200 shadow-md"
                            whileTap={{ scale: 0.95 }}
                        >
                            {isLogin ? 'Login' : 'Signup'}
                        </motion.button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        {isLogin ? (
                            <>
                                Don’t have an account?{' '}
                                <span
                                    onClick={() => {
                                        setBusinessName('');
                                        setEmail('');
                                        setPassword('');
                                        setErrors({}); // Clear the validation errors
                                        setIsLogin(false); // or true depending on which direction you're toggling
                                    }}
                                    className="text-[#F8486E] font-semibold cursor-pointer hover:underline"
                                >
                                    Signup
                                </span>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <span
                                    onClick={() => {
                                        setBusinessName('');
                                        setEmail('');
                                        setPassword('');
                                        setErrors({}); // Clear the validation errors
                                        setIsLogin(true); // or false depending on direction
                                    }}
                                    className="text-[#F8486E] font-semibold cursor-pointer hover:underline"
                                >
                                    Login
                                </span>

                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;