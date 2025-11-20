import React from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';

import adminImg from "../../assets/admin.png";
import sellerImg from '../../assets/seller.png';
import moment from 'moment';

const AdminDashboard = () => {

    // Dummy Data
    const totalSale = 12000;
    const totalProduct = 560;
    const totalSeller = 40;
    const totalOrder = 980;

    const userInfo = {
        _id: "123",
        image: adminImg
    };

    const recentMessage = [
        { senderId: "123", senderName: "Admin", message: "Order shipped!", createdAt: new Date() },
        { senderId: "555", senderName: "Seller 1", message: "Product updated", createdAt: new Date() },
    ];

    const recentOrder = [
        { _id: "ORD101", price: 299, payment_status: "Paid", delivery_status: "Delivered" },
        { _id: "ORD102", price: 499, payment_status: "Pending", delivery_status: "Processing" },
    ];

    // Chart
    const state = {
        series: [
            {
                name: "Orders",
                data: [23, 34, 45, 56, 76, 34, 23, 76, 87, 78, 34, 45]
            },
            {
                name: "Revenue",
                data: [67, 39, 45, 56, 90, 56, 23, 56, 87, 78, 67, 78]
            },
            {
                name: "Sellers",
                data: [34, 39, 56, 56, 80, 67, 23, 56, 98, 78, 45, 56]
            },
        ],
        options: {
            chart: {
                background: 'transparent',
                foreColor: '#d0d2d6'
            },
            dataLabels: { enabled: false },
            xaxis: {
                categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
            },
            legend: { position: 'top' }
        }
    };

    return (
        <div className="px-2 md:px-7 py-5 text-white">

            {/* --------- TOP CARDS --------- */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">

                <div className="p-5 bg-[#1B2033] border border-[#2A3144] rounded-xl flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold">${totalSale}</h2>
                        <span>Total Sales</span>
                    </div>
                    <div className="w-12 h-12 bg-[#fa0305] rounded-full flex justify-center items-center">
                        <MdCurrencyExchange className="text-white text-xl" />
                    </div>
                </div>

                <div className="p-5 bg-[#1B2033] border border-[#2A3144] rounded-xl flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold">{totalProduct}</h2>
                        <span>Products</span>
                    </div>
                    <div className="w-12 h-12 bg-[#760077] rounded-full flex justify-center items-center">
                        <MdProductionQuantityLimits className="text-white text-xl" />
                    </div>
                </div>

                <div className="p-5 bg-[#1B2033] border border-[#2A3144] rounded-xl flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold">{totalSeller}</h2>
                        <span>Sellers</span>
                    </div>
                    <div className="w-12 h-12 bg-[#038000] rounded-full flex justify-center items-center">
                        <FaUsers className="text-white text-xl" />
                    </div>
                </div>

                <div className="p-5 bg-[#1B2033] border border-[#2A3144] rounded-xl flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold">{totalOrder}</h2>
                        <span>Orders</span>
                    </div>
                    <div className="w-12 h-12 bg-[#0200f8] rounded-full flex justify-center items-center">
                        <FaCartShopping className="text-white text-xl" />
                    </div>
                </div>
            </div>

            {/* --------- CHART + MESSAGES --------- */}
            <div className="w-full flex flex-wrap mt-7">

                {/* Chart */}
                <div className="w-full lg:w-7/12 lg:pr-3">
                    <div className="bg-[#1B2033] border border-[#2A3144] p-4 rounded-xl">
                        <Chart options={state.options} series={state.series} type="bar" height={350} />
                    </div>
                </div>

                {/* Messages */}
                <div className="w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0">
                    <div className="bg-[#1B2033] border border-[#2A3144] p-5 rounded-xl">

                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Recent Seller Messages</h2>
                            <Link className="text-sm text-blue-400">View All</Link>
                        </div>

                        <div className="mt-6 flex flex-col gap-4">

                            {recentMessage.map((m, i) => {
                                const profileImg =
                                    m.senderId === userInfo._id ? adminImg : sellerImg;

                                return (
                                    <div
                                        key={i}
                                        className="flex items-start gap-4 bg-[#252B3F] border border-[#31384A] p-4 rounded-xl"
                                    >
                                        {/* Avatar */}
                                        <img
                                            src={profileImg}
                                            className="w-12 h-12 rounded-full object-cover border border-[#2A3144]"
                                        />

                                        {/* Message */}
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm text-gray-300">
                                                <span>{m.senderName}</span>
                                                <span>{moment(m.createdAt).fromNow()}</span>
                                            </div>

                                            <p className="mt-3 p-2 bg-[#1B2033] rounded-lg text-xs text-gray-200">
                                                {m.message}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>

                    </div>
                </div>
            </div>

            {/* --------- RECENT ORDERS TABLE --------- */}
            <div className="w-full bg-[#1B2033] border border-[#2A3144] rounded-xl mt-6 p-5">

                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Recent Orders</h2>
                    <Link className="text-sm text-blue-400">View All</Link>
                </div>

                <div className="relative overflow-x-auto mt-4">
                    <table className="w-full text-sm text-left">

                        <thead className="border-b border-[#2A3144] text-gray-300">
                            <tr>
                                <th className="py-3 px-4">Order ID</th>
                                <th className="py-3 px-4">Price</th>
                                <th className="py-3 px-4">Payment</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentOrder.map((d, i) => (
                                <tr key={i} className="border-b border-[#23293A]">
                                    <td className="py-3 px-4">#{d._id}</td>
                                    <td className="py-3 px-4">${d.price}</td>
                                    <td className="py-3 px-4">{d.payment_status}</td>
                                    <td className="py-3 px-4">{d.delivery_status}</td>
                                    <td className="py-3 px-4">
                                        <Link className="text-blue-400">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
