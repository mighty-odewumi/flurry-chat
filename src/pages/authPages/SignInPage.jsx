import { Form, Link } from "react-router-dom";
// import email from "./././assets/splash-assets/message-icon1.png";
// import password from "./././assets/splash-assets/lock-icon1.png";


export async function action() {
  return null;
}


export default function SignInPage() {


  return (
    <>
      <div className="font-inter p-4">
        <h1 className="font-bold text-2xl mb-8">
          Login to Your Account
        </h1>

        <Form method="post">
          <div className="relative ">
            <img src={email} alt="email icon" />
            <input 
              type="email" 
              name="email" 
              id="email" 
              placeholder="Email"
              className="bg-gray-100 w-full mb-4 py-2 px-4 rounded-md"

            />
          </div>
          
          <div className="relative ">
            <img src={password} alt="password icon" />
            <input 
              type="password" 
              name="password" 
              id="password" 
              placeholder="Password"
              className="bg-gray-100 w-full mb-4 py-2 px-4 rounded-md"

            />
          </div>

          <button 
            className="rounded-md bg-blue-500 text-white py-2 px-4 w-full mb-4"
          >
            Sign in
          </button>
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
