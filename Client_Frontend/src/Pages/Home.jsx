// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";

// function Home() {
//   const [activeQuestion, setActiveQuestion] = useState(null);
//   const location = useLocation();
//   const { orderId, orderStatus } = location.state || {};

//   const faqData = [
//     {
//       question: "What payment methods do you accept?",
//       answer:
//         "Paying for your order is easy!  We accept both UPI and Cash on Delivery (COD).",
//     },
//     {
//       question: "Are all your dishes 100% vegetarian?",
//       answer:
//         "Absolutely! All our dishes are 100% vegetarian, prepared in a meat-free kitchen to ensure there is no cross-contamination with non-vegetarian ingredients.",
//     },
//     {
//       question: "Do you use organic ingredients in your dishes?",
//       answer:
//         "Many of our dishes are made with fresh, organic ingredients. Look for the Organic tag on the menu items.",
//     },
//   ];

//   const toggleAnswer = (index) => {
//     setActiveQuestion(activeQuestion === index ? null : index);
//   };

//   const progressSteps = [
//     "Order Placed",
//     "Preparing",
//     "Out for Delivery",
//     "Delivered",
//   ];

//   const getProgressPercentage = () => {
//     if (!orderStatus || orderStatus === "Cancelled") return 0;
//     const statusIndex = progressSteps.indexOf(orderStatus);
//     if (statusIndex === -1) return 0;
//     return (statusIndex / (progressSteps.length - 1)) * 100;
//   };

//   return (
//     <div className="bg-gray-100">
//       <div
//         className="pr-2 overflow-y-auto h-[95vh]"
//         style={{
//           msOverflowStyle: "none", // For IE/Edge (legacy)
//           scrollbarWidth: "none", // For Firefox
//         }}
//       >
//         {/* Order Progress Bar (shown only if order is in progress) */}
//         {orderId &&
//           orderStatus &&
//           orderStatus !== "Delivered" &&
//           orderStatus !== "Cancelled" && (
//             <div className="bg-white shadow-md rounded-lg p-6 mx-4 mt-4 max-w-3xl md:mx-auto">
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                 Your Order (ID: {orderId})
//               </h3>
//               <p className="text-sm text-gray-600 mb-4">
//                 Status: <span className="text-orange-500">{orderStatus}</span>
//               </p>
//               <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
//                 <div
//                   className="bg-orange-400 h-2 rounded-full transition-all duration-500"
//                   style={{ width: `${getProgressPercentage()}%` }}
//                 ></div>
//               </div>
//               <div className="flex justify-between text-xs text-gray-600">
//                 {progressSteps.map((status, index) => (
//                   <span
//                     key={index}
//                     className={`font-medium ${
//                       orderStatus === status ||
//                       getProgressPercentage() >=
//                         (index / (progressSteps.length - 1)) * 100
//                         ? "text-orange-500"
//                         : ""
//                     }`}
//                   >
//                     {status}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//         {/* Intro starts here */}

//         <div className=" p-8 rounded-lg flex flex-col md:flex-row">
//           <div className="md:w-1/2 md:pr-8 content-center">
//             <h2 className="text-5xl font-bold text-gray-800 mb-4">
//               Deliciousness at
//               <br /> Your Doorstep
//             </h2>
//             <p className="text-gray-600 mb-6 text-xl">
//               Indulge in gourmet flavors delivered straight to your door,
//               ensuring a delightful meal every time.
//             </p>
//             <div className="flex space-x-4">
//               <button className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
//                 <Link to="/restaurants">Get Started</Link>
//               </button>
//             </div>
//           </div>

//           <div className="md:w-1/2 h-96 rounded-lg overflow-hidden relative">
//             <div className="absolute inset-0 bg-opacity-50 bg-repeat bg-center">
//               <img src="/First_Redirect.jpeg" alt="Food Image" />
//             </div>
//           </div>
//         </div>

//         {/* How it works starts here */}

//         <div className="py-12">
//           <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
//             {/* Header Section */}
//             <div className="text-center mb-16">
//               <h2 className="text-4xl font-bold text-gray-800">How it Works</h2>
//               <p className="mt-4 text-lg text-gray-600">
//                 "Receive your food fresh and hot, and indulge in a delightful
//                 dining experience."
//               </p>
//             </div>

//             {/* Steps Section */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//               {/* Step 1 */}
//               <div className="flex flex-col items-center shadow-md bg-white rounded-lg h-64">
//                 <div className="p-6 rounded-full bg-orange-500 text-white w-24 h-24 flex items-center justify-center shadow-lg mt-8">
//                   {/* Search Logo */}
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="2"
//                     stroke="currentColor"
//                     className="w-12 h-12"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M21 21l-4.35-4.35"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-2">
//                   Choose Your Favorite
//                 </h3>
//                 <p className="text-center text-gray-600">
//                   Browse our extensive menu and select the
//                   <br /> dishes you love most.
//                 </p>
//               </div>

//               {/* Step 2 */}
//               <div className="flex flex-col items-center shadow-md bg-white rounded-lg h-64">
//                 <div className="p-6 rounded-full bg-orange-500 text-white w-24 h-24 flex items-center justify-center shadow-lg mt-7">
//                   {/* Add to Cart Logo */}
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="2"
//                     stroke="currentColor"
//                     className="w-12 h-12 mt-3"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M3 3h2l.4 2m0 0h13.2l1.4-2M5.4 5l1.6 8h9.8l1.6-8m-15 0h15m-10 11a1.5 1.5 0 1 1-3 0m10 0a1.5 1.5 0 1 1-3 0"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-2">
//                   Add to Cart
//                 </h3>
//                 <p className="text-center text-gray-600">
//                   Add your selected items to the cart and proceed <br />
//                   to checkout.
//                 </p>
//               </div>

//               {/* Step 3 */}
//               <div className="flex flex-col items-center shadow-md bg-white rounded-lg h-64">
//                 <div className="p-6 rounded-full bg-orange-500 text-white w-24 h-24 flex items-center justify-center shadow-lg mt-7">
//                   {/* Checkmark Logo */}
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="2"
//                     stroke="currentColor"
//                     className="w-12 h-12"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-2">
//                   Enjoy Your Meal
//                 </h3>
//                 <p className="text-center text-gray-600">
//                   Sit back and enjoy your freshly prepared
//                   <br /> meals with ease.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Top food starts here */}

//         <div className="py-12 pb-2">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold text-gray-800">
//                 Our Featured Food
//               </h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
//                 <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
//                   <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
//                     <img
//                       src="/Pizza.png"
//                       alt="Our Chef"
//                       className="absolute inset-0 w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-800 mb-2">
//                   Pizza with dripping cheese
//                 </h3>
//                 <p className="text-gray-600 flex-grow mb-4">
//                   Authentic Italian Pizza, Made with Fresh Ingredients.
//                 </p>
//               </div>

//               <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
//                 <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
//                   <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
//                     <img
//                       src="/Dosa.png"
//                       alt="Our Chef"
//                       className="absolute inset-0 w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-800 mb-2">
//                   Dosa with Sambar and Chutney
//                 </h3>
//                 <p className="text-gray-600 flex-grow mb-4">
//                   Crispy Dosa, Flavorful Sambar, and Tangy Chutney.
//                 </p>
//               </div>

//               <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
//                 <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
//                   <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
//                     <img
//                       src="/Vadapav.png"
//                       alt="Our Chef"
//                       className="absolute inset-0 w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-800 mb-2">
//                   Vada Pav
//                 </h3>
//                 <p className="text-gray-600 flex-grow">
//                   The Iconic Mumbai Vada Pav, Bursting with Flavor.
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="text-center mt-8">
//             <Link to="/restaurants">
//               <button className="relative inline-flex items-center justify-start overflow-hidden transition-all duration-500 ease-in-out group w-44 h-14">
//                 {/* Expanding Background */}
//                 <span className="absolute left-0 flex items-center justify-center w-12 h-12 transition-all duration-500 ease-in-out bg-orange-400 rounded-full group-hover:w-full group-hover:rounded-lg"></span>

//                 {/* Stable Arrow Head (Now Positioned Outside Expanding Element) */}
//                 <span className="relative z-10 ml-4 w-3 h-3 border-t-2 border-r-2 border-white rotate-45"></span>

//                 {/* Button Text */}
//                 <span className="relative z-10 ml-6 text-gray-800 font-bold uppercase text-sm tracking-widest transition-all duration-500 ease-in-out group-hover:text-white">
//                   View More
//                 </span>
//               </button>
//             </Link>
//           </div>
//         </div>

//         {/* Achivements starts here */}

//         <div className="flex items-center justify-evenly p-8 mt-10">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-gray-800 ">
//               Service shows <br />
//               good taste.
//             </h1>
//           </div>
//           <div className="flex">
//             <div className="text-center mx-5 bg-white rounded-lg shadow-md p-6 w-52">
//               <h2 className="text-4xl font-bold text-orange-400 hover:text-orange-500">
//                 976
//               </h2>
//               <p className="text-gray-500">Satisfied Customer</p>
//             </div>
//             <div className="text-center mx-5 bg-white rounded-lg shadow-md p-6 w-52">
//               <h2 className="text-4xl font-bold text-orange-400 hover:text-orange-500">
//                 99+
//               </h2>
//               <p className="text-gray-500">Food Selections</p>
//             </div>
//             <div className="text-center mx-5 bg-white rounded-lg shadow-md p-6 w-52">
//               <h2 className="text-4xl font-bold text-orange-400 hover:text-orange-500">
//                 1K+
//               </h2>
//               <p className="text-gray-500">Food Delivered</p>
//             </div>
//           </div>
//         </div>
//         {/* review starts here */}

//         <div className="py-12">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold text-gray-800">
//                 What Customers Say...
//               </h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <div className="flex items-center mb-4">
//                   <div className="pr-4">
//                     <img
//                       src="https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"
//                       alt="User Profile"
//                       className="h-14 w-14 rounded-full border-2 shadow-md bg-cover"
//                     />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-800">
//                       Maria Rodriguez
//                     </h3>
//                     <p className="text-gray-600 text-sm">@mariarodriguez</p>
//                   </div>
//                 </div>
//                 <p className="text-gray-600">
//                   The food arrived hot and fresh, just like I ordered it! The
//                   quality is consistently excellent, and I'm always impressed
//                   with the delicious meals from this website.
//                 </p>
//               </div>

//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <div className="flex items-center mb-4">
//                   <div className="pr-4">
//                     <img
//                       src="https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"
//                       alt="User Profile"
//                       className="h-14 w-14 rounded-full border-2 shadow-md bg-cover"
//                     />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-800">
//                       David Chen
//                     </h3>
//                     <p className="text-gray-600 text-sm">@davidchen</p>
//                   </div>
//                 </div>
//                 <p className="text-gray-600">
//                   This website has made my life so much easier! No more phone
//                   calls or waiting on hold. I can easily browse menus, customize
//                   my order, and pay securely online. Highly recommend!
//                 </p>
//               </div>

//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <div className="flex items-center mb-4">
//                   <div className="pr-4">
//                     <img
//                       src="https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"
//                       alt="User Profile"
//                       className="h-14 w-14 rounded-full border-2 shadow-md bg-cover"
//                     />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-800">
//                       Sarah Miller
//                     </h3>
//                     <p className="text-gray-600 text-sm">@sarahmiller</p>
//                   </div>
//                 </div>
//                 <p className="text-gray-600">
//                   Ordering from this website was a breeze! The interface is
//                   clean and intuitive, making it super easy to find what I
//                   wanted and place my order quickly. Love the convenience!
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Chefs starts here */}

//         <div className="py-12">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold text-gray-800">
//                 Meet Our Chefs!
//               </h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
//                 <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
//                   <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
//                     <img src="/Chef_Emma.jpeg" alt="Our Chef" />
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-800 mb-2">
//                   Chef Emma
//                 </h3>
//                 <p className="text-gray-600 flex-grow">
//                   Elevating every dish with elegance and creativity.
//                 </p>
//               </div>

//               <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
//                 <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
//                   <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
//                     <img src="/Chef_James.jpeg" alt="Our Chef" />
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-800 mb-2">
//                   Chef James
//                 </h3>
//                 <p className="text-gray-600 flex-grow">
//                   Passion and precision in every plate he crafts.
//                 </p>
//               </div>

//               <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
//                 <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
//                   <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
//                     <img src="/Chef_Lily.jpeg" alt="Our Chef" />
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-800 mb-2">
//                   Chef Lily
//                 </h3>
//                 <p className="text-gray-600 flex-grow">
//                   Bold flavors and inventive twists in every bite.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* last redirect starts here */}

//         <div className="p-8 rounded-lg flex flex-col md:flex-row mt-10">
//           <div className="md:w-1/2 md:pr-8 content-center">
//             <h2 className="text-5xl font-bold text-gray-800 mb-4">
//               Get Started Today!
//             </h2>
//             <p className="text-gray-600 mb-6 text-xl">
//               Indulge in gourmet flavors delivered straight to your door,
//               ensuring a delightful meal every time.
//             </p>
//             <div className="flex space-x-4">
//               <button className=" bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded">
//                 <Link to="/restaurants">Get Started</Link>
//               </button>
//             </div>
//           </div>

//           <div className="md:w-1/2 h-96 bg-gray-200 rounded-lg overflow-hidden relative">
//             <div className="absolute inset-0 bg-gray-300 bg-opacity-50 h-full w-full bg-center">
//               <img src="/Last_Redirect.png" alt="Food Image" />
//             </div>
//           </div>
//         </div>

//         {/* FAQ starts here */}

//         <div className="p-8 rounded-lg shadow-md">
//           <h2 className="text-2xl font-bold text-center mb-6">FAQ</h2>

//           <div className="space-y-4 mx-10">
//             {faqData.map((item, index) => (
//               <div key={index}>
//                 <button
//                   className="flex items-center justify-between w-full text-left"
//                   onClick={() => toggleAnswer(index)}
//                 >
//                   <span className="font-medium">{item.question}</span>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className={`h-5 w-5 transition-transform ${
//                       activeQuestion === index ? "rotate-180" : ""
//                     }`}
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>
//                 <div
//                   className={`${
//                     activeQuestion === index ? "block" : "hidden"
//                   } mt-2`}
//                 >
//                   <p className="text-gray-700">{item.answer}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Home() {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const location = useLocation();
  const { orderId, orderStatus } = location.state || {};

  const faqData = [
    {
      question: "What payment methods do you accept?",
      answer:
        "Paying for your order is easy!  We accept both UPI and Cash on Delivery (COD).",
    },
    {
      question: "Are all your dishes 100% vegetarian?",
      answer:
        "Absolutely! All our dishes are 100% vegetarian, prepared in a meat-free kitchen to ensure there is no cross-contamination with non-vegetarian ingredients.",
    },
    {
      question: "Do you use organic ingredients in your dishes?",
      answer:
        "Many of our dishes are made with fresh, organic ingredients. Look for the Organic tag on the menu items.",
    },
  ];

  const toggleAnswer = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const progressSteps = [
    "Order Placed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  const getProgressPercentage = () => {
    if (!orderStatus || orderStatus === "Cancelled") return 0;
    const statusIndex = progressSteps.indexOf(orderStatus);
    if (statusIndex === -1) return 0;
    return (statusIndex / (progressSteps.length - 1)) * 100;
  };

  return (
    <div className="bg-gray-100">
      <div
        className="pr-2 overflow-y-auto h-[95vh]"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {/* Intro starts here */}
        <div className=" p-8 rounded-lg flex flex-col md:flex-row">
          <div className="md:w-1/2 md:pr-8 content-center">
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Deliciousness at
              <br /> Your Doorstep
            </h2>
            <p className="text-gray-600 mb-6 text-xl">
              Indulge in gourmet flavors delivered straight to your door,
              ensuring a delightful meal every time.
            </p>
            <div className="flex space-x-4">
              <button className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
                <Link to="/restaurants">Get Started</Link>
              </button>
            </div>
          </div>
          <div className="md:w-1/2 h-96 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-opacity-50 bg-repeat bg-center">
              <img src="/First_Redirect.jpeg" alt="Food Image" />
            </div>
          </div>
        </div>

        {/* How it works starts here */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800">How it Works</h2>
              <p className="mt-4 text-lg text-gray-600">
                "Receive your food fresh and hot, and indulge in a delightful
                dining experience."
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center shadow-md bg-white rounded-lg h-64">
                <div className="p-6 rounded-full bg-orange-500 text-white w-24 h-24 flex items-center justify-center shadow-lg mt-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-2">
                  Choose Your Favorite
                </h3>
                <p className="text-center text-gray-600">
                  Browse our extensive menu and select the
                  <br /> dishes you love most.
                </p>
              </div>
              <div className="flex flex-col items-center shadow-md bg-white rounded-lg h-64">
                <div className="p-6 rounded-full bg-orange-500 text-white w-24 h-24 flex items-center justify-center shadow-lg mt-7">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-12 h-12 mt-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2m0 0h13.2l1.4-2M5.4 5l1.6 8h9.8l1.6-8m-15 0h15m-10 11a1.5 1.5 0 1 1-3 0m10 0a1.5 1.5 0 1 1-3 0"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-2">
                  Add to Cart
                </h3>
                <p className="text-center text-gray-600">
                  Add your selected items to the cart and proceed <br />
                  to checkout.
                </p>
              </div>
              <div className="flex flex-col items-center shadow-md bg-white rounded-lg h-64">
                <div className="p-6 rounded-full bg-orange-500 text-white w-24 h-24 flex items-center justify-center shadow-lg mt-7">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-2">
                  Enjoy Your Meal
                </h3>
                <p className="text-center text-gray-600">
                  Sit back and enjoy your freshly prepared
                  <br /> meals with ease.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top food starts here */}
        <div className="py-12 pb-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Our Featured Food
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
                    <img
                      src="/Pizza.png"
                      alt="Our Chef"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Pizza with dripping cheese
                </h3>
                <p className="text-gray-600 flex-grow mb-4">
                  Authentic Italian Pizza, Made with Fresh Ingredients.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
                    <img
                      src="/Dosa.png"
                      alt="Our Chef"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Dosa with Sambar and Chutney
                </h3>
                <p className="text-gray-600 flex-grow mb-4">
                  Crispy Dosa, Flavorful Sambar, and Tangy Chutney.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
                    <img
                      src="/Vadapav.png"
                      alt="Our Chef"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Vada Pav
                </h3>
                <p className="text-gray-600 flex-grow">
                  The Iconic Mumbai Vada Pav, Bursting with Flavor.
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/restaurants">
              <button className="relative inline-flex items-center justify-start overflow-hidden transition-all duration-500 ease-in-out group w-44 h-14">
                <span className="absolute left-0 flex items-center justify-center w-12 h-12 transition-all duration-500 ease-in-out bg-orange-400 rounded-full group-hover:w-full group-hover:rounded-lg"></span>
                <span className="relative z-10 ml-4 w-3 h-3 border-t-2 border-r-2 border-white rotate-45"></span>
                <span className="relative z-10 ml-6 text-gray-800 font-bold uppercase text-sm tracking-widest transition-all duration-500 ease-in-out group-hover:text-white">
                  View More
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Achievements starts here */}
        <div className="flex items-center justify-evenly p-8 mt-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 ">
              Service shows <br />
              good taste.
            </h1>
          </div>
          <div className="flex">
            <div className="text-center mx-5 bg-white rounded-lg shadow-md p-6 w-52">
              <h2 className="text-4xl font-bold text-orange-400 hover:text-orange-500">
                976
              </h2>
              <p className="text-gray-500">Satisfied Customer</p>
            </div>
            <div className="text-center mx-5 bg-white rounded-lg shadow-md p-6 w-52">
              <h2 className="text-4xl font-bold text-orange-400 hover:text-orange-500">
                99+
              </h2>
              <p className="text-gray-500">Food Selections</p>
            </div>
            <div className="text-center mx-5 bg-white rounded-lg shadow-md p-6 w-52">
              <h2 className="text-4xl font-bold text-orange-400 hover:text-orange-500">
                1K+
              </h2>
              <p className="text-gray-500">Food Delivered</p>
            </div>
          </div>
        </div>

        {/* Review starts here */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                What Customers Say...
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="pr-4">
                    <img
                      src="https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"
                      alt="User Profile"
                      className="h-14 w-14 rounded-full border-2 shadow-md bg-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Maria Rodriguez
                    </h3>
                    <p className="text-gray-600 text-sm">@mariarodriguez</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  The food arrived hot and fresh, just like I ordered it! The
                  quality is consistently excellent, and I'm always impressed
                  with the delicious meals from this website.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="pr-4">
                    <img
                      src="https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"
                      alt="User Profile"
                      className="h-14 w-14 rounded-full border-2 shadow-md bg-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      David Chen
                    </h3>
                    <p className="text-gray-600 text-sm">@davidchen</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  This website has made my life so much easier! No more phone
                  calls or waiting on hold. I can easily browse menus, customize
                  my order, and pay securely online. Highly recommend!
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="pr-4">
                    <img
                      src="https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"
                      alt="User Profile"
                      className="h-14 w-14 rounded-full border-2 shadow-md bg-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Sarah Miller
                    </h3>
                    <p className="text-gray-600 text-sm">@sarahmiller</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Ordering from this website was a breeze! The interface is
                  clean and intuitive, making it super easy to find what I
                  wanted and place my order quickly. Love the convenience!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chefs starts here */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Meet Our Chefs!
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
                    <img src="/Chef_Emma.jpeg" alt="Our Chef" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Chef Emma
                </h3>
                <p className="text-gray-600 flex-grow">
                  Elevating every dish with elegance and creativity.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
                    <img src="/Chef_James.jpeg" alt="Our Chef" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Chef James
                </h3>
                <p className="text-gray-600 flex-grow">
                  Passion and precision in every plate he crafts.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
                    <img src="/Chef_Lily.jpeg" alt="Our Chef" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Chef Lily
                </h3>
                <p className="text-gray-600 flex-grow">
                  Bold flavors and inventive twists in every bite.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Last redirect starts here */}
        <div className="p-8 rounded-lg flex flex-col md:flex-row mt-10">
          <div className="md:w-1/2 md:pr-8 content-center">
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Get Started Today!
            </h2>
            <p className="text-gray-600 mb-6 text-xl">
              Indulge in gourmet flavors delivered straight to your door,
              ensuring a delightful meal every time.
            </p>
            <div className="flex space-x-4">
              <button className=" bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded">
                <Link to="/restaurants">Get Started</Link>
              </button>
            </div>
          </div>
          <div className="md:w-1/2 h-96 bg-gray-200 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gray-300 bg-opacity-50 h-full w-full bg-center">
              <img src="/Last_Redirect.png" alt="Food Image" />
            </div>
          </div>
        </div>

        {/* FAQ starts here */}
        <div className="p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">FAQ</h2>
          <div className="space-y-4 mx-10">
            {faqData.map((item, index) => (
              <div key={index}>
                <button
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => toggleAnswer(index)}
                >
                  <span className="font-medium">{item.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      activeQuestion === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`${
                    activeQuestion === index ? "block" : "hidden"
                  } mt-2`}
                >
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Progress Bar (moved to bottom center) */}
        {orderId &&
          orderStatus &&
          orderStatus !== "Delivered" &&
          orderStatus !== "Cancelled" && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-lg p-6 max-w-3xl w-full mx-4 z-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Your Order (ID: {orderId})
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Status: <span className="text-orange-500">{orderStatus}</span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-orange-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                {progressSteps.map((status, index) => (
                  <span
                    key={index}
                    className={`font-medium ${
                      orderStatus === status ||
                      getProgressPercentage() >=
                        (index / (progressSteps.length - 1)) * 100
                        ? "text-orange-500"
                        : ""
                    }`}
                  >
                    {status}
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default Home;
