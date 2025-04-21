// // import React, { useState } from "react";
// // import axios from "axios";
// // import { Link } from "react-router-dom";
// // import { ApiError } from "../../../Backend/src/utils/ApiError";
// // function Signup() {
// //   const [formData, setFormData] = useState({
// //     name: "",

// //     email: "",

// //     phone: "",

// //     password: "",

// //     confirmPassword: "",
// //   });

// //   const [error, setError] = useState({});
// //   const [success, setSuccess] = useState("");

// //   const handleInputChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     setSuccess("");
// //     setError({});

// //     let newErrors = {};

// //     Object.keys(formData).forEach((fields) => {
// //       if (!formData[fields]) {
// //         newErrors[fields] = `*Please Enter Your ${
// //           fields.charAt(0).toUpperCase() + fields.slice(1)
// //         }`;
// //       }
// //     });

// //     if (formData.password !== formData.confirmPassword) {
// //       newErrors.confirmPassword = "*Password does not match";
// //     }

// //     if (formData.phone.length !== 10 || /[^0-9]/.test(formData.phone)) {
// //       newErrors.phone = "*Please enter a valid 10-digit phone number";
// //     }

// //     setError(newErrors);

// //     if (Object.keys(newErrors).length > 0) return;

// //     const { confirmPassword, ...dataToSend } = formData;
// //     console.log(dataToSend);

// //     try {
// //       const response = await axios.post(
// //         "/api/v1/user/register", // Replace with your backend API URL
// //         dataToSend
// //       );
// //       setSuccess(response.data.message || "User registered successfully!");
// //       setError({});
// //       setFormData({
// //         name: "",
// //         email: "",
// //         password: "",
// //         phone: "",
// //         confirmPassword: "",
// //       });

// //       window.location.href = "/login";
// //     } catch (err) {
// //       // const errorMessage =
// //       //   err.response?.data?.message || "Something went wrong!";
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         "User Already Exist with this Email or Phone Number!";
// //       setError({ ApiError: errorMessage });
// //     }
// //   };

// //   return (
// //     <div className="bg-gray-100 font-sans h-screen flex items-center justify-center">
// //       <div className="container mx-auto px-8 py-8 shadow-lg w-1/3 rounded-lg bg-white">
// //         <h2 className="text-3xl font-bold text-center mb-6 text-orange-400">
// //           Registration
// //         </h2>

// //         <div className="max-w-md mx-auto lg:max-w-lg">
// //           <form onSubmit={handleSubmit}>
// //             {Object.keys(formData).map((fields) => (
// //               <div key={fields} className=" mb-3">
// //                 {/* <div className=" flex"> */}
// //                 <label className="block text-gray-800 text-sm font-bold mb-2">
// //                   {fields.charAt(0).toUpperCase() + fields.slice(1)}
// //                 </label>

// //                 {/* </div> */}

// //                 <input
// //                   className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-100"
// //                   type={fields.includes("password") ? "password" : "text"}
// //                   value={formData[fields]}
// //                   name={fields}
// //                   onChange={handleInputChange}
// //                   placeholder={`Enter Your ${
// //                     fields.charAt(0).toUpperCase() + fields.slice(1)
// //                   }`}
// //                 />
// //                 <label className="block text-red-500 text-sm font-normal mb-2 ">
// //                   {error[fields]}
// //                 </label>
// //               </div>
// //             ))}

// //             <label className="block text-red-500 text-sm font-normal mb-2 ">
// //               {error.ApiError}
// //             </label>

// //             <div className="text-center">
// //               {/* <Link to="/login"> */}
// //               <button
// //                 type="submit"
// //                 className="bg-orange-400 text-white px-16 py-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:bg-orange-500 hover:border-orange-500 hover:border-2 mt-2"
// //               >
// //                 Register
// //               </button>
// //               {/* </Link> */}
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Signup;
// // import React, { useState } from "react";
// // import axios from "axios";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // function Signup() {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     phone: "",
// //     password: "",
// //     confirmPassword: "",
// //   });

// //   const [error, setError] = useState({});

// //   const handleInputChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     setError({});

// //     let newErrors = {};

// //     Object.keys(formData).forEach((fields) => {
// //       if (!formData[fields]) {
// //         newErrors[fields] = `*Please Enter Your ${
// //           fields.charAt(0).toUpperCase() + fields.slice(1)
// //         }`;
// //       }
// //     });

// //     if (formData.password !== formData.confirmPassword) {
// //       newErrors.confirmPassword = "*Password does not match";
// //     }

// //     if (formData.phone.length !== 10 || /[^0-9]/.test(formData.phone)) {
// //       newErrors.phone = "*Please enter a valid 10-digit phone number";
// //     }

// //     setError(newErrors);

// //     if (Object.keys(newErrors).length > 0) return;

// //     const { confirmPassword, ...dataToSend } = formData;
// //     console.log(dataToSend);

// //     try {
// //       const response = await axios.post(
// //         "/api/v1/user/register", // Replace with your backend API URL
// //         dataToSend
// //       );
// //       toast.success(response.data.message || "Registration Successful!", {
// //         position: "bottom-center",
// //         autoClose: 2000,
// //         hideProgressBar: true,
// //         style: { backgroundColor: "black", color: "white", width: "300px" },
// //       });
// //       setError({});
// //       setFormData({
// //         name: "",
// //         email: "",
// //         password: "",
// //         phone: "",
// //         confirmPassword: "",
// //       });
// //       // Redirect to login after 2 seconds to allow the toast to be visible
// //       setTimeout(() => {
// //         window.location.href = "/login";
// //       }, 2000);
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         "User Already Exists with this Email or Phone Number!";
// //       setError({ ApiError: errorMessage });
// //     }
// //   };

// //   return (
// //     <div className="bg-gray-100 font-sans h-screen flex items-center justify-center">
// //       <div className="container mx-auto px-8 py-8 shadow-lg w-1/3 rounded-lg bg-white">
// //         <h2 className="text-3xl font-bold text-center mb-6 text-orange-400">
// //           Registration
// //         </h2>

// //         <div className="max-w-md mx-auto lg:max-w-lg">
// //           <form onSubmit={handleSubmit}>
// //             {Object.keys(formData).map((fields) => (
// //               <div key={fields} className="mb-3">
// //                 <label className="block text-gray-800 text-sm font-bold mb-2">
// //                   {fields.charAt(0).toUpperCase() + fields.slice(1)}
// //                 </label>
// //                 <input
// //                   className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-100"
// //                   type={fields.includes("password") ? "password" : "text"}
// //                   value={formData[fields]}
// //                   name={fields}
// //                   onChange={handleInputChange}
// //                   placeholder={`Enter Your ${
// //                     fields.charAt(0).toUpperCase() + fields.slice(1)
// //                   }`}
// //                 />
// //                 <label className="block text-red-500 text-sm font-normal mb-2">
// //                   {error[fields]}
// //                 </label>
// //               </div>
// //             ))}

// //             {/* API Error Message */}
// //             <label className="block text-red-500 text-sm font-normal mb-2">
// //               {error.ApiError}
// //             </label>

// //             <div className="text-center">
// //               <button
// //                 type="submit"
// //                 className="bg-orange-400 text-white px-16 py-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:bg-orange-500 hover:border-orange-500 hover:border-2 mt-2"
// //               >
// //                 Register
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </div>

// //       {/* ToastContainer for black-themed popup */}
// //       <ToastContainer
// //         position="bottom-center"
// //         autoClose={2000}
// //         hideProgressBar={true}
// //         style={{ width: "300px" }}
// //       />
// //     </div>
// //   );
// // }

// // export default Signup;
// import React, { useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function Signup() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState({});

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError({});
//     let newErrors = {};

//     Object.keys(formData).forEach((fields) => {
//       if (!formData[fields]) {
//         newErrors[fields] = `*Please Enter Your ${
//           fields.charAt(0).toUpperCase() + fields.slice(1)
//         }`;
//       }
//     });

//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "*Password does not match";
//     }

//     if (formData.phone.length !== 10 || /[^0-9]/.test(formData.phone)) {
//       newErrors.phone = "*Please enter a valid 10-digit phone number";
//     }

//     setError(newErrors);

//     if (Object.keys(newErrors).length > 0) return;

//     const { confirmPassword, ...dataToSend } = formData;
//     try {
//       const response = await axios.post("/api/v1/user/register", dataToSend);
//       toast.success(response.data.message || "Registration Successful!", {
//         position: "bottom-center",
//         autoClose: 2000,
//         hideProgressBar: true,
//         style: { backgroundColor: "black", color: "white", width: "300px" },
//       });
//       setError({});
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         phone: "",
//         confirmPassword: "",
//       });
//       setTimeout(() => {
//         window.location.href = "/login";
//       }, 2000);
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         "User Already Exists with this Email or Phone Number!";
//       setError({ ApiError: errorMessage });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 font-sans flex items-center justify-center p-4">
//       <div className="w-full max-w-4xl h-[650px] bg-gray-100 flex overflow-hidden shadow-xl rounded-xl">
//         {/* Left Side - Details */}
//         <div className="w-1/2 bg-orange-400 p-8 flex items-center text-gray-100 rounded-lg">
//           <div>
//             <h3 className="text-2xl font-bold mb-4">Join Us Now!</h3>
//             <p className="text-sm mb-4">
//               Create your account and enjoy the best food delivery experience.
//             </p>
//             <ul className="space-y-2 text-sm">
//               <li className="flex items-center gap-2">
//                 <span className="text-xl text-white">✓</span> Easy Registration
//                 Process
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="text-xl text-white">✓</span> Personalized
//                 Dashboard
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="text-xl text-white">✓</span> Seamless Food
//                 Ordering
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Right Side - Signup Form */}
//         <div className="w-1/2 p-8 bg-gray-100 flex items-center rounded-r-xl">
//           <div className="w-full">
//             <h2 className="text-3xl font-bold text-orange-400 mb-6 text-center">
//               Registration
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {Object.keys(formData).map((fields) => (
//                 <div key={fields}>
//                   <label className="block text-orange-400 text-sm font-bold mb-1">
//                     {fields.charAt(0).toUpperCase() + fields.slice(1)}
//                   </label>
//                   <input
//                     className="w-full px-3 py-2 border border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-100"
//                     type={fields.includes("password") ? "password" : "text"}
//                     value={formData[fields]}
//                     name={fields}
//                     onChange={handleInputChange}
//                     placeholder={`Enter Your ${
//                       fields.charAt(0).toUpperCase() + fields.slice(1)
//                     }`}
//                   />
//                   <span className="block text-red-500 text-xs mt-1">
//                     {error[fields]}
//                   </span>
//                 </div>
//               ))}

//               {/* API Error Message */}
//               {error.ApiError && (
//                 <div className="text-red-500 text-sm text-center mb-4">
//                   {error.ApiError}
//                 </div>
//               )}

//               <div>
//                 <button
//                   type="submit"
//                   className="w-full bg-orange-400 text-gray-100 py-2 rounded-md font-semibold hover:bg-orange-500 transition-colors duration-200"
//                 >
//                   Register
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// }

// export default Signup;
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom"; // Import Link for navigation

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    let newErrors = {};

    Object.keys(formData).forEach((fields) => {
      if (!formData[fields]) {
        newErrors[fields] = `*Please Enter Your ${
          fields.charAt(0).toUpperCase() + fields.slice(1)
        }`;
      }
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "*Password does not match";
    }

    if (formData.phone.length !== 10 || /[^0-9]/.test(formData.phone)) {
      newErrors.phone = "*Please enter a valid 10-digit phone number";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const { confirmPassword, ...dataToSend } = formData;
    try {
      const response = await axios.post("/api/v1/user/register", dataToSend);
      toast.success(response.data.message || "Registration Successful!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "300px" },
      });
      setError({});
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "User Already Exists with this Email or Phone Number!";
      setError({ ApiError: errorMessage });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl flex rounded-lg overflow-hidden">
        {/* Left Side - Image with Orange Curved Background */}
        <div
          className="md:w-1/2 relative hidden md:block"
          style={{ minHeight: "400px" }}
        >
          <div
            className="absolute inset-0 bg-orange-400"
            style={{
              clipPath: "ellipse(80% 100% at 20% 50%)",
              backgroundImage: "url('/fastfood1.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl text-gray-800 mb-6 text-center">
              Registration
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(formData).map((fields) => (
                <div key={fields}>
                  <label className="block text-gray-800 text-sm mb-1">
                    {fields.charAt(0).toUpperCase() + fields.slice(1)}
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                    type={fields.includes("password") ? "password" : "text"}
                    value={formData[fields]}
                    name={fields}
                    onChange={handleInputChange}
                    placeholder={`Enter Your ${
                      fields.charAt(0).toUpperCase() + fields.slice(1)
                    }`}
                  />
                  <span className="block text-red-500 text-xs mt-1">
                    {error[fields]}
                  </span>
                </div>
              ))}

              {/* API Error Message */}
              {error.ApiError && (
                <div className="text-red-500 text-sm text-center mb-4">
                  {error.ApiError}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full bg-orange-400 text-gray-100 py-2 rounded-md font-semibold hover:bg-orange-500 transition-colors duration-200"
                >
                  Register
                </button>
              </div>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-400 font-semibold hover:text-orange-500 hover:font-bold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
