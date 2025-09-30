// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import InputTextFeild from "../Inputs/InputTextFeild";
// import { Button } from "../ui/button";
// import InputPassword from "../Inputs/InputPassword";

// const SignInForm = ({ onSubmit }) => {
//   const schema = yup.object().shape({
//     emailOrUsername: yup.string().required("Email is required"),
//     // .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
//     password: yup
//       .string()
//       .required("Password is required")
//       .min(8, "Password must be at least 8 characters"),
//   });

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   return (
//     <div className="bg-brown-eeb py-10 md:py-16 px-4 md:px-28 max-w-3xl w-full flex flex-col items-center rounded-2xl">
//       <form onSubmit={handleSubmit(onSubmit)} className="w-full">
//         <h2 className="text-h2 text-center text-brown-31e! mb-10">Log In</h2>
//         <div className="input_wrap  mb-7">
//           <Controller
//             control={control}
//             render={({ field }) => (
//               <InputTextFeild
//                 {...field}
//                 label={"Email / Username"}
//                 placeholder="Email or Username"
//                 errors={errors.emailOrUsername?.message}
//               />
//             )}
//             name="emailOrUsername"
//             defaultValue=""
//           />
//         </div>
//         <div className="input_wrap mb-7">
//           <Controller
//             control={control}
//             render={({ field }) => (
//               <InputPassword
//                 {...field}
//                 type={"password"}
//                 label={"Password"}
//                 placeholder="Password"
//                 errors={errors.password?.message}
//               />
//             )}
//             name="password"
//             defaultValue=""
//           />
//         </div>
//         <div className="btn_wrap flex justify-center mb-10">
//           <Button className={"btn-31e"}>Sign In</Button>
//         </div>
//         <div className="text-b1 text-brown-16b! flex gap-x-3 justify-center">
//           Don’t have any account?{" "}
//           <a
//             href="/Register"
//             className="text-brown-31e underline cursor-pointer hover:text-brown-16b"
//           >
//             Sign up
//           </a>
//         </div>
//       </form>
//     </div>
//   );
// };

// SignInForm.propTypes = {};

// export default SignInForm;
