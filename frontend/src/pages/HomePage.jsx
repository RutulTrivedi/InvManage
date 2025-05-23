import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import Illu1 from '../assets/home/what.png';
import Logo from '../assets/logo.png';
import Icon1 from '../assets/home/location.png';
import Icon2 from '../assets/home/cart.png';
import Icon3 from '../assets/home/spreadsheet.png';

const HomePage = () => {
    return (
        <div className="w-full min-h-screen bg-[#FFFFFF] text-[#000000] font-sans flex flex-col overflow-auto">
            <header className="flex items-center justify-between px-8 py-2 bg-white shadow-md">
                <div className="flex items-center space-x-3">
                    <img src={Logo} alt="Logo" className="w-24 h-24 object-contain" />
                    <div className="text-3xl font-bold italic">InvManage</div>
                </div>
                <Link to="/login">
                    <button className="bg-[#F8486E] hover:bg-red-500 text-white px-6 py-2 rounded-full font-medium transition">
                        Open business
                    </button>
                </Link>
            </header>
            <main className="flex-grow px-10 py-16">
                <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 w-full max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-5xl font-bold leading-tight mb-6">
                            What is <br /> InvManage?
                        </h1>
                        <p className="text-gray-700 text-lg mb-8">
                            InvManage is a powerful, user-friendly inventory and location-based stock management platform built using the MERN stack. It helps businesses efficiently manage their stock, track quantities across locations, and streamline operations.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <motion.img
                            src={Illu1}
                            alt="Inventory Illustration"
                            className="max-w-full h-auto"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        />

                    </div>
                </section>

                <section className="mt-20 w-full max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12">Why InvManage?</h2>
                    <div className="grid md:grid-cols-3 gap-8 px-4">
                        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                            <motion.img
                                src={Icon1}
                                alt="Tracking"
                                className="w-32 h-28 mx-auto mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.3 }}
                            />

                            <h3 className="text-xl font-semibold mb-2">Multiple Locations, <br /> One Dashboard</h3>
                            <p className="text-gray-600">Businesses often operate across various locations or warehouses. Tracking inventory across all of them becomes complex and prone to errors.</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                            <motion.img
                                src={Icon2}
                                alt="Tracking"
                                className="w-32 h-28 mx-auto mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.3 }}
                            />

                            <h3 className="text-xl font-semibold mb-2">Avoid Overstocking <br /> And Understocking</h3>
                            <p className="text-gray-600">Poor stock visibility leads to either over-purchasing or stockouts, both of which harm profits and operations.</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                            <motion.img
                                src={Icon3}
                                alt="Tracking"
                                className="w-32 h-28 mx-auto mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.3 }}
                            />

                            <h3 className="text-xl font-semibold mb-2">Manual Tracking <br /> Means Mistakes</h3>
                            <p className="text-gray-600">Traditional spreadsheets or paper records are inefficient, outdated, and error-prone.</p>
                        </div>
                    </div>
                </section>
                <section className="mt-24 w-full max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16">How It Works?</h2>
                    <div className="space-y-12">
                        <div className="flex items-start text-start space-x-6 border-l-4 border-[#F8486E] pl-6 py-4 transition-all duration-300 hover:bg-[#f0faff] rounded-lg">
                            <div className="bg-[#F8486E] text-white font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-lg transform transition-all hover:scale-110">
                                1
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-semibold mb-2">User Signup & Login</h3>
                                <p className="text-gray-600 text-lg">Secure authentication allows users to manage inventory.</p>
                            </div>
                        </div>
                        <div className="flex items-start text-start space-x-6 border-l-4 border-[#F8486E] pl-6 py-4 transition-all duration-300 hover:bg-[#f0faff] rounded-lg">
                            <div className="bg-[#F8486E] text-white font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-lg transform transition-all hover:scale-110">
                                2
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-semibold mb-2">Add Multiple Locations</h3>
                                <p className="text-gray-600 text-lg">Admins can create multiple stock locations such as warehouses, shops, or branches.</p>
                            </div>
                        </div>
                        <div className="flex items-start text-start space-x-6 border-l-4 border-[#F8486E] pl-6 py-4 transition-all duration-300 hover:bg-[#f0faff] rounded-lg">
                            <div className="bg-[#F8486E] text-white font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-lg transform transition-all hover:scale-110">
                                3
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-semibold mb-2">Add and Track Items</h3>
                                <p className="text-gray-600 text-lg">Create items and manage stock quantity, price, and type — per location.</p>
                            </div>
                        </div>
                        <div className="flex items-start text-start space-x-6 border-l-4 border-[#F8486E] pl-6 py-4 transition-all duration-300 hover:bg-[#f0faff] rounded-lg">
                            <div className="bg-[#F8486E] text-white font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-lg transform transition-all hover:scale-110">
                                4
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-semibold mb-2">Stock Transfers & Updates</h3>
                                <p className="text-gray-600 text-lg">Easily transfer items between locations or update stock details when changes occur.</p>
                            </div>
                        </div>
                        <div className="flex items-start text-start space-x-6 border-l-4 border-[#F8486E] pl-6 py-4 transition-all duration-300 hover:bg-[#f0faff] rounded-lg">
                            <div className="bg-[#F8486E] text-white font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-lg transform transition-all hover:scale-110">
                                5
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-semibold mb-2">Real-time Dashboard</h3>
                                <p className="text-gray-600 text-lg">Get a complete overview of your inventory status, including total stock, low-stock alerts, and stock per location.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="border-t-2 border-gray-100 text-center py-6 mt-auto">
                <p className="text-gray-600 text-sm tracking-wider">
                    Developed by <span className="font-medium text-[#F8486E]">Rutul Trivedi</span>
                </p>
            </footer>

        </div>
    );
};

export default HomePage;