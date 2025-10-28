import React, { useState } from "react";
import { Button } from "../ui/button";
import NavBarWidget from "./NavBarWidget";
import DoneRound from "../Icons/DoneRound";
import Image from "next/image";
import {
  PinFill,
  DateTodayLight,
  TimeFill,
  Shop,
  ExpandRightLight,
  CloseRoundLight,
} from "../Icons/Icons";

const BookingCouponWidget = () => {
  const [showCouponExpiredAlert, setShowCouponExpiredAlert] = useState(false);
  const [showPaymentFailAlert, setShowPaymentFailAlert] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "credit" | "qr"
  >("credit");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);

  // Coupon data from CouponCardWidget
  const coupons = [
    {
      title: "Minor Cineplex x COKE JOYFUL",
      image:
        "https://scontent.fbkk35-1.fna.fbcdn.net/v/t39.30808-6/488662032_1067044625458469_6102952748846026734_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=aeHYqU_XrcAQ7kNvwHNhGUU&_nc_oc=AdmDUpOBA60BQUKcKfM0_RXYU1sUerdB6__IWjROuuR3z6zhMDIYpI3ZlK0V7L4vZPNp2WDaTw4851UJyqPoGDYm&_nc_zt=23&_nc_ht=scontent.fbkk35-1.fna&_nc_gid=qOUuI96sTn5yHdeH5xdKOw&oh=00_AfY8aeve2tbYzAkeWx9WGQsW4hm7zkYRy5iU84-k-S4Opg&oe=68D73BE1",
      validUntil: "31 Dec 2024",
    },
    {
      title: "Redeem 999 UOB Rewards",
      image: "/images/coupon.png",
      validUntil: "31 Dec 2024",
    },
    {
      title: "GSB Credit Cards (All Types)",
      image: "/images/coupon.png",
      validUntil: "31 Dec 2024",
    },
    {
      title: "UOB Visa Infinite",
      image: "/images/coupon.png",
      validUntil: "25 Dec 2026",
    },
  ];

  // Credit card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardOwner, setCardOwner] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardOwner: "",
    expiryDate: "",
    cvc: "",
  });

  // Function to check if coupon is expired
  const checkCouponExpiry = (couponTitle: string) => {
    // Find the selected coupon from the coupons array
    const selectedCouponData = coupons.find(
      (coupon) => coupon.title === couponTitle
    );

    if (!selectedCouponData) {
      return false; // If coupon not found, consider it not expired
    }

    // Parse the validUntil date (format: "31 Dec 2024")
    const validUntilStr = selectedCouponData.validUntil;
    const [day, month, year] = validUntilStr.split(" ");

    // Convert month name to number
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = monthNames.indexOf(month);

    if (monthIndex === -1) {
      return false; // Invalid month format
    }

    // Create expiry date
    const expiryDate = new Date(parseInt(year), monthIndex, parseInt(day));
    const currentDate = new Date();

    // Check if current date is after expiry date
    return currentDate > expiryDate;
  };

  // Input formatting functions
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
    if (match) {
      return [match[1], match[2], match[3], match[4]].filter(Boolean).join(" ");
    }
    return cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  // Validation functions
  const validateCardNumber = (value: string) => {
    if (!value) return "Card number is required";
    const cardNumberRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
    if (!cardNumberRegex.test(value)) return "Card number is not valid";
    return "";
  };

  const validateCardOwner = (value: string) => {
    if (!value) return "Card owner name is required";
    if (value.trim().length < 2) return "Card owner name is not valid";
    return "";
  };

  const validateExpiryDate = (value: string) => {
    if (!value) return "Expiry date is required";
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(value)) return "Expiry date is not valid";
    return "";
  };

  const validateCvc = (value: string) => {
    if (!value) return "CVC is required";
    const cvcRegex = /^\d{3}$/;
    if (!cvcRegex.test(value)) return "CVC is not valid";
    return "";
  };

  // Real-time validation
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    const error = validateCardNumber(formatted);
    setErrors((prev) => ({ ...prev, cardNumber: error }));
  };

  const handleCardOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardOwner(value);
    const error = validateCardOwner(value);
    setErrors((prev) => ({ ...prev, cardOwner: error }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
    const error = validateExpiryDate(formatted);
    setErrors((prev) => ({ ...prev, expiryDate: error }));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCvc(value);
      const error = validateCvc(value);
      setErrors((prev) => ({ ...prev, cvc: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      cardNumber: validateCardNumber(cardNumber),
      cardOwner: validateCardOwner(cardOwner),
      expiryDate: validateExpiryDate(expiryDate),
      cvc: validateCvc(cvc),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Check if form is valid for credit card
  const isCreditCardFormValid = () => {
    if (selectedPaymentMethod !== "credit") return true;
    return (
      cardNumber.length === 19 &&
      cardOwner.trim().length >= 2 &&
      expiryDate.length === 5 &&
      cvc.length === 3 &&
      !errors.cardNumber &&
      !errors.cardOwner &&
      !errors.expiryDate &&
      !errors.cvc
    );
  };

  const handleNextClick = () => {
    if (selectedPaymentMethod === "credit") {
      if (!validateForm()) {
        return;
      }
    }

    // Check if coupon is expired (only if a coupon is selected)
    const isCouponExpired = selectedCoupon && checkCouponExpiry(selectedCoupon);
    const isPaymentFailed = false;

    if (isCouponExpired) {
      setShowCouponExpiredAlert(true);
    } else if (isPaymentFailed) {
      setShowPaymentFailAlert(true);
    } else {
      console.log("Proceed to next step");
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
            <span className="text-base text-white text-center">
              Select showtime
            </span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="stp-done w-14 h-14 text-lg">
              <DoneRound width="20" height="20" />
            </div>
            <span className="text-base text-white text-center">
              Select seat
            </span>
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
                <button
                  onClick={() => setSelectedPaymentMethod("credit")}
                  className={`pb-2 font-medium transition-colors ${
                    selectedPaymentMethod === "credit"
                      ? "text-white border-b-2 border-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Credit card
                </button>
                <button
                  onClick={() => setSelectedPaymentMethod("qr")}
                  className={`pb-2 font-medium transition-colors ${
                    selectedPaymentMethod === "qr"
                      ? "text-white border-b-2 border-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  QR Code
                </button>
              </div>
            </div>

            {/* Payment Content */}
            {selectedPaymentMethod === "credit" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex flex-col">
                    <div className="text-gray-gedd text-fr-16">Card number</div>
                    <input
                      type="text"
                      placeholder="Card number"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className={`bg-gray-g63f border rounded-sm h-12 pl-4 pr-3 py-3 text-white placeholder-gray-400 focus:outline-none w-full ${errors.cardNumber ? "border-red-r64b" : "border-gray-gf7e focus:border-gray-g3b0"}`}
                    />
                    {errors.cardNumber && (
                      <span className="text-red-r64b text-sm mt-0.5">
                        {errors.cardNumber}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="text-gray-gedd text-fr-16">Card owner</div>
                    <input
                      type="text"
                      placeholder="Card owner name"
                      value={cardOwner}
                      onChange={handleCardOwnerChange}
                      className={`bg-gray-g63f border rounded-sm h-12 pl-4 pr-3 py-3 text-white placeholder-gray-400 focus:outline-none w-full ${errors.cardOwner ? "border-red-r64b" : "border-gray-gf7e focus:border-gray-g3b0"}`}
                    />
                    {errors.cardOwner && (
                      <span className="text-red-r64b text-sm mt-0.5">
                        {errors.cardOwner}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex flex-col flex-1 relative">
                    <div className="text-gray-gedd text-fr-16">Expiry date</div>
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        maxLength={5}
                        className={`bg-gray-g63f border rounded-sm h-12 pl-4 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none w-full ${errors.expiryDate ? "border-red-r64b" : "border-gray-gf7e focus:border-gray-g3b0"}`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <DateTodayLight
                          width="16"
                          height="16"
                          color="#C8CEDD"
                        />
                      </div>
                    </div>
                    {errors.expiryDate && (
                      <span className="text-red-r64b text-sm mt-0.5">
                        {errors.expiryDate}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="text-gray-gedd text-fr-16">CVC</div>
                    <input
                      type="text"
                      placeholder="CVC"
                      value={cvc}
                      onChange={handleCvcChange}
                      maxLength={3}
                      className={`bg-gray-g63f border rounded-sm h-12 pl-4 pr-3 py-3 text-white placeholder-gray-400 focus:outline-none w-full ${errors.cvc ? "border-red-r64b" : "border-gray-gf7e focus:border-gray-g3b0"}`}
                    />
                    {errors.cvc && (
                      <span className="text-red-r64b text-sm mt-0.5">
                        {errors.cvc}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-gray-g63f p-6 min-h-[120px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-xl font-medium">
                    QR Code Payment
                  </div>
                </div>
              </div>
            )}
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
                <div className="relative w-full h-64 sm:h-80 md:h-96">
                  <Image
                    src="https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg"
                    alt="The Dark Knight"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white text-lg font-semibold mb-2">
                  The Dark Knight
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-gf7e text-white text-xs px-2 py-1 rounded">
                    Action
                  </span>
                  <span className="bg-gray-gf7e text-white text-xs px-2 py-1 rounded">
                    Crime
                  </span>
                  <span className="bg-gray-gf7e text-white text-xs px-2 py-1 rounded">
                    TH
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <PinFill width="16" height="16" color="#C8CEDD" />
                <span className="text-white text-sm">
                  Minor Cineplex Arkham
                </span>
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
                <button
                  onClick={() => setShowCouponModal(true)}
                  className="hover:opacity-80 transition-opacity"
                >
                  <ExpandRightLight width="16" height="16" color="#C8CEDD" />
                </button>
              </div>
              {selectedCoupon ? (
                <div className="rounded-lg p-3 flex items-center justify-between bg-gray-g63f border border-gray-gf7e">
                  <span className="text-white text-sm">{selectedCoupon}</span>
                  <button
                    onClick={() => setSelectedCoupon(null)}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <CloseRoundLight width="16" height="16" color="#C8CEDD" />
                  </button>
                </div>
              ) : (
                <div className="rounded-lg p-3 flex items-center justify-between bg-gray-g63f border border-gray-gf7e">
                  <span className="text-white text-sm">No coupon selected</span>
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
                <span className="text-white text-sm">
                  {selectedPaymentMethod === "credit"
                    ? "Credit card"
                    : "QR Code"}
                </span>
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
              disabled={!isCreditCardFormValid()}
              className={`w-full py-3 rounded-lg font-semibold ${
                isCreditCardFormValid()
                  ? "bg-blue-bbee hover:bg-blue-b9a8 text-white cursor-pointer"
                  : "bg-gray-g63f text-gray-g3b0 cursor-not-allowed"
              }`}
            >
              Next
            </Button>

            {/* Coupon Expired Alert Banner - Overlapping Next Button */}
            {showCouponExpiredAlert && (
              <div className="absolute -bottom-15 -left-8 -right-8 bg-red-r64b/70 p-4 rounded z-10">
                <div className="relative">
                  <div className="flex-1 pr-8">
                    <h3 className="text-white font-bold text-lg mb-1">
                      Coupon Expired
                    </h3>
                    <p className="text-white text-sm">
                      This coupon is no longer valid. Please check for other
                      available offers.
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

            {/* Payment Fail Alert Banner - Overlapping Next Button */}
            {showPaymentFailAlert && (
              <div className="absolute -bottom-15 -left-8 -right-8 bg-red-r64b/70 p-4 rounded z-10">
                <div className="relative">
                  <div className="flex-1 pr-8">
                    <h3 className="text-white font-bold text-lg mb-1">
                      Payment fail
                    </h3>
                    <p className="text-white text-sm">Please try again.</p>
                  </div>
                  <button
                    onClick={() => setShowPaymentFailAlert(false)}
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

      {/* Coupon Selection Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-gc1b opacity-60"
            onClick={() => setShowCouponModal(false)}
          ></div>

          <div className="relative bg-gray-g63f rounded-lg p-6 w-full max-w-2xl mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">
                Select coupon
              </h2>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <CloseRoundLight width="24" height="24" />
              </button>
            </div>

            {/* Coupon Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {coupons.map((coupon, index) => (
                <div
                  key={index}
                  className={`rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${
                    selectedCoupon === coupon.title ? "ring-2 ring-white" : ""
                  }`}
                  onClick={() => setSelectedCoupon(coupon.title)}
                >
                  <div className="flex h-32 rounded-lg overflow-hidden bg-gray-gc1b">
                    {/* Left Container - Image */}
                    <div className="flex-1 relative">
                      <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900">
                        <Image
                          src={coupon.image}
                          alt={coupon.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Right Container - Text Information */}
                    <div className="w-48 bg-gray-gc1b p-4 flex flex-col justify-between">
                      <div>
                        <div className="text-white text-sm font-bold mb-2">
                          {coupon.title}
                        </div>
                        <div className="text-gray-300 text-xs">
                          Valid until {coupon.validUntil}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 mt-4">
                        <a
                          href={`/coupons/${index + 1}`}
                          className="text-white text-xs underline cursor-pointer hover:text-gray-300"
                        >
                          View details
                        </a>
                        <ExpandRightLight
                          width="12"
                          height="12"
                          color="#FFFFFF"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between">
              <button
                onClick={() => setShowCouponModal(false)}
                className="px-6 py-2 border border-gray-gf7e text-white rounded-lg hover:bg-gray-gf7e transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setShowCouponModal(false);
                  // selectedCoupon is already set when user clicks on a coupon
                }}
                className="px-6 py-2 bg-blue-bbee text-white rounded-lg hover:bg-blue-b9a8 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCouponWidget;
