/* eslint-disable react/prop-types */
import { Form, Link } from "react-router-dom";
import email from "../../assets/splash-assets/message-icon1.png";
import password from "../../assets/splash-assets/lock-icon1.png";
import FlurryLogo from "../FlurryLogo";


export default function Onboarding({ errors, navigation, data }) {
  return (
    <>
      <div className="font-inter p-6 md:w-96 md:m-auto">
        
        <FlurryLogo />

        <h1 className="font-bold text-2xl mb-8 mt-10">
          Login to Your Account
        </h1>

        {(data) && <h3 className="mt-4 mb-4 text-xl text-red-800">{data}</h3>}

        <Form method="post" replace>
          <div className="relative mb-4">
            <img 
              src={email} 
              alt="email icon" 
              className="w-4 absolute top-3 left-3"
            />
            <input 
              type="email" 
              name="email" 
              id="email" 
              placeholder="Email"
              className="bg-gray-100 w-full  py-2 px-9 rounded-md"
            />

            {// eslint-disable-next-line react/prop-types
            errors?.email 
              // eslint-disable-next-line react/prop-types
              && <span className="text-sm ">{errors.email}</span>
            }
          </div>
          
          <div className="relative mb-4">
            <img 
              src={password} 
              alt="password icon" 
              className="w-4 absolute top-3 left-3"
            />
            <input 
              type="password" 
              name="password" 
              id="password" 
              placeholder="Password"
              className="bg-gray-100 w-full py-2 px-9 rounded-md"
            />
            {
              // eslint-disable-next-line react/prop-types
              errors?.password 
                // eslint-disable-next-line react/prop-types
                && <span className="text-sm ">{errors.password}</span>
            }
          </div>

          <button 
            className="rounded-md bg-blue-500 text-white py-2 px-4 w-full mb-4 hover:bg-bluegradient transition-all"
            disabled={navigation.state === "submitting"}
          >
            {
              // eslint-disable-next-line react/prop-types
              navigation.state === "submitting" 
                ? "Signing in..."
                : "Sign in"
            }
          </button>

          {
            errors?.firebaseErr 
              && <span className="text-red-800 text-xl mb-2 block">{errors.firebaseErr}</span>
          }
        </Form>

        <p className="text-center">
          Don&apos;t have an account?
          <Link 
            to="/signup"
            className="text-bluegradient "
          >
            &nbsp;Sign up
          </Link>
        </p>
      </div>
    </>
  )
}

