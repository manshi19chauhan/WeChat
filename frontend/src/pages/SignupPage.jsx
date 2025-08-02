import { useState } from 'react';
import { Video } from "lucide-react";
import {Link } from "react-router";
import useSignup from "../hooks/useSignup.js";

const SignupPage = () => {

  const [signupData, setSignupData] = useState({
    fullname:"",
    email:"",
    password:"",
  });

  // This is how we did it at first, without using our custom hook
  /* const queryClient = useQueryClient();
  const {
    mutate : signupMutation,
    isPending,
    error,
  } = useMutation({
      mutationFn: signup,// sending a req to the endpoint with the signup data
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }), //everything went somethly so we gonna refetch the query
  }); */
    // This is how we did it using our custom hook
  const { isPending, error, signupMutation } = useSignup();


  const handleSignup = (e) => { //on clicking submit it runs
    e.preventDefault(); //prevents from refreshing the page
    signupMutation(signupData); //call it then
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="retro"> 
      <div className="border border-promary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* SIGNUP FORM - LEFT SIDE*/}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/*LOGO*/}
          <div className="mb-4 flex items-center justify-start gap-2">
            <Video className="size-9 text-primary"/>
            <span className="text-3xl font-bold font-mono bg-clip-text text- transport bg-gradient-to-r from-primary to-secondary tracking-wider">
              WeChat
            </span>
          </div>

          {/* error msg if any */}
          {error && (
            <div className="alert alert-error mb-4"> 
              <span>{error.response.data.message}</span>
            </div>
          )}
          {/* signup form*/}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Create an Account
                  </h2>
                  <p className="text-sm opacity-70">
                    Join WeChat and start your language learning adventure!
                  </p>
                </div>

                <div className="space-y-3">
                  {/* full name */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input 
                     type="text"
                     placeholder='John Doe'
                     className="input input-bordered w-full"
                     value={signupData.fullname}
                     onChange={(e) => setSignupData({...signupData, fullname: e.target.value})}
                     required
                    />
                  </div>
                  {/* email */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input 
                     type="email"
                     placeholder='johndoe@gmail.com'
                     className="input input-bordered w-full"
                     value={signupData.email}
                     onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                     required
                    />
                  </div>
                  {/* password */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input 
                     type="password"
                     placeholder="at least 6 characters"
                     className="input input-bordered w-full"
                     value={signupData.password}
                     onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                     required
                    />
                  </div>
                </div>  
                {/* submit button */}
                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* already have an account */}
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* image on right side */}
        <div className="hidden lg:flex flex-col w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          {/* illustration */}
          <div className="relative aspect-square max-w-sm mx-auto">
            <img src="/v1.png" alt="Language connection illustration" className="w-full h-full" />
          </div>
          <div className="text-center space-y-3 mt-6">
            <h2 className="text-xl font-semibold ">Connect with language partners worldwide</h2>
          </div>
        </div>
      </div>
    </div>
  )
};

export default SignupPage;