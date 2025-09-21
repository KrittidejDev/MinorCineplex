import React, { useState } from 'react';
import { Button } from '../ui/button';
import InputTextFeild from '../Inputs/InputTextFeild';
import NavBarWidget from './NavBarWidget';
import DoneRound from '../Icons/DoneRound';
import { ErrorAlert } from '../ui/alert';
import {
    LogoM,
    UserDuotone,
    ArrowDown,
    DoneRound as DoneRoundIcon,
    PinFill,
    DateTodayLight,
    TimeFill,
    Shop,
    CouponLight,
    ExpandRightLight,
    CloseRoundLight
} from '../Icons/Icons';

const BookingCouponWidget = () => {
    const [showCouponExpiredAlert, setShowCouponExpiredAlert] = useState(false);
    const [showPaymentFailAlert, setShowPaymentFailAlert] = useState(false);

    const handleNextClick = () => {

        const isCouponExpired = true;
        const isPaymentFailed = true;

        if (isCouponExpired) {
            setShowCouponExpiredAlert(true);
        } else if (isPaymentFailed) {
            setShowPaymentFailAlert(true);
        } else {
            console.log('Proceed to next step');
        }
    };

    return (
        <div className="w-full">
            <NavBarWidget />
            <div className="flex flex-col items-center gap-5 py-6 bg-gray-gc1b">
                <div className="flex justify-between w-full max-w-sm">
                    <div className="flex flex-col items-center gap-3">
                        <div className="stp-done w-14 h-14 text-lg">
                            <DoneRound width="20" height="20" />
                        </div>
                        <span className="text-base text-white text-center">Select showtime</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="stp-done w-14 h-14 text-lg">
                            <DoneRound width="20" height="20" />
                        </div>
                        <span className="text-base text-white text-center">Select seat</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="stp-current w-14 h-14 text-lg">3</div>
                        <span className="text-base text-white text-center">Payment</span>
                    </div>
                </div>
            </div>
            {/* Main Payment Content */}
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 py-8 mt-20">
                {/* Left Side - Payment Form */}
                <div className="flex-1 max-w-2xl lg:max-w-none">
                    <div className="space-y-6">
                        {/* Payment Method Selection */}
                        <div className="space-y-4">

                            <div className="flex space-x-6">
                                <button className="text-white border-b-2 border-white pb-2 font-medium">
                                    Credit card
                                </button>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    QR Code
                                </button>
                            </div>
                        </div>

                        {/* Credit Card Form */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <InputTextFeild
                                    label="Card number"
                                    placeholder="Enter card number"
                                    value="1712 2223 3725 8896"
                                    className="bg-gray-g63f border-gray-gf7e text-white"
                                />
                                <InputTextFeild
                                    label="Card owner"
                                    placeholder="Enter card owner name"
                                    value="Bruce Wayne"
                                    className="bg-gray-g63f border-gray-gf7e text-white"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="flex flex-col flex-1 gap-1 relative">
                                    <div className="text-gray-gedd text-fr-16">
                                        Expiry date
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            value="12/27"
                                            className="bg-gray-g63f border border-gray-gf7e rounded-sm h-12 pl-4 pr-10 py-3 text-white placeholder-gray-400 focus:border-gray-g3b0 focus:outline-none w-full"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <DateTodayLight width="16" height="16" color="#C8CEDD" />
                                        </div>
                                    </div>
                                </div>
                                <InputTextFeild
                                    label="CVC"
                                    placeholder="CVC"
                                    value="787"
                                    className="bg-gray-g63f border-gray-gf7e text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Booking Summary */}
                <div className="flex-1 max-w-sm mx-auto lg:mx-0 lg:max-w-80 lg:ml-16">
                    <div className="bg-gray-gc1b rounded-lg p-6 space-y-6 relative">
                        {/* Time Remaining */}
                        <div className="text-center">
                            <span className="text-white text-sm">Time remaining: </span>
                            <span className="text-red-r64b text-sm font-semibold">04:55</span>
                        </div>

                        {/* Movie Details */}
                        <div className="flex space-x-4">
                            <div className="w-20 h-28 rounded-lg flex-shrink-0 overflow-hidden">
                                <img
                                    src="https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg"
                                    alt="The Dark Knight"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white text-lg font-semibold mb-2">The Dark Knight</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-gray-gf7e text-white text-xs px-2 py-1 rounded">Action</span>
                                    <span className="bg-gray-gf7e text-white text-xs px-2 py-1 rounded">Crime</span>
                                    <span className="bg-gray-gf7e text-white text-xs px-2 py-1 rounded">TH</span>
                                </div>
                            </div>
                        </div>

                        {/* Booking Information */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <PinFill width="16" height="16" color="#C8CEDD" />
                                <span className="text-white text-sm">Minor Cineplex Arkham</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <DateTodayLight width="16" height="16" color="#C8CEDD" />
                                <span className="text-white text-sm">24 Jun 2024</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <TimeFill width="16" height="16" color="#C8CEDD" />
                                <span className="text-white text-sm">16:30</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Shop width="16" height="16" color="#C8CEDD" />
                                <span className="text-white text-sm">Hall 1</span>
                            </div>
                        </div>

                        {/* Coupon Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-white font-medium">Coupon</span>
                                <ExpandRightLight width="16" height="16" color="#C8CEDD" />
                            </div>
                            <div className={`rounded-lg p-3 flex items-center justify-between ${showCouponExpiredAlert ? 'border-2 border-red-r64b bg-gray-gf7e' : 'bg-gray-gf7e'}`}>
                                <span className="text-white text-sm">KBANK Customers Redeem 5,500 K Poi...</span>
                                <CloseRoundLight width="16" height="16" color="#C8CEDD" />
                            </div>
                            {showCouponExpiredAlert && (
                                <div className="text-red-r64b text-sm font-medium">
                                    Coupon Expired
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="space-y-3 pt-4 border-t border-gray-gf7e">
                            <div className="flex justify-between">
                                <span className="text-gray-gedd text-sm">Selected Seat</span>
                                <span className="text-white text-sm">C9, C10</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-gedd text-sm">Payment method</span>
                                <span className="text-white text-sm">Credit card</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-gedd text-sm">Coupon</span>
                                <span className="text-green-g372 text-sm">-THB20</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold">
                                <span className="text-white">Total</span>
                                <span className="text-white">THB330</span>
                            </div>
                        </div>

                        {/* Next Button */}
                        <Button
                            onClick={handleNextClick}
                            className="w-full bg-blue-bbee hover:bg-blue-b9a8 text-white py-3 rounded-lg font-semibold"
                        >
                            Next
                        </Button>

                        {/* Coupon Expired Alert Banner - Overlapping Next Button */}
                        {showCouponExpiredAlert && (
                            <div className="absolute -bottom-17 -left-8 -right-8 bg-red-r64b/80 p-4 rounded z-10">
                                <div className="relative">
                                    <div className="flex-1 pr-8">
                                        <h3 className="text-white font-bold text-lg mb-1">Coupon Expired</h3>
                                        <p className="text-white text-sm">
                                            This coupon is no longer valid. Please check for other available offers.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowCouponExpiredAlert(false)}
                                        className="absolute top-0 right-0 text-white hover:text-gray-200"
                                    >
                                        <CloseRoundLight width="20" height="20" color="#FFFFFF" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Fail Alert Banner - Fixed at bottom */}
            {showPaymentFailAlert && (
                <div className="fixed bottom-0 left-0 right-0 bg-red-r64b p-4 z-50">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 pr-8">
                            <h3 className="text-white font-bold text-lg mb-1">Payment fail</h3>
                            <p className="text-white text-sm">
                                Please try again.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowPaymentFailAlert(false)}
                            className="text-white hover:text-gray-200"
                        >
                            <CloseRoundLight width="20" height="20" color="#FFFFFF" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingCouponWidget;
