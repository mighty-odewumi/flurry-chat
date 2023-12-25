import { Navigate, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import chatLogo from "../assets/splash-assets/chat-logo18.png";
import { deleteApp } from "firebase/app";
// import splash from "../assets/splash-assets/splash1.jpg";

function timeDelay() {
  return setTimeout(() => {
    redirect("/signin");
  });
}

export async function loader() {
  return timeDelay();
}

export default function SplashScreen() {

  const data = useLoaderData();
  console.log(data);

  function delay() {
    return setTimeout(() => {
      <Navigate to="/signin" />
    }, 2000);
  }
  
  return (
    <>
      <div 
        className="bg-bluegradient flex flex-col gap-1 justify-center items-center h-screen"
      >
        <motion.div
          initial={{ transform: "translateY(100px)" }}
          animate={{ transform: "translateY(0px)" }}
          transition={{ type: "spring", stiffness: 50, ease: "easeOut", }}
          className="flex flex-col justify-center items-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, repeatDelay: 1, duration: 2, ease: "easeIn" }}
          >
            <img 
              src={chatLogo} 
              alt="someone using a phone" 
              className="w-16 "
            />  
          </motion.div>

          <h1 className="text-3xl font-inter font-bold text-white tracking-widest mt-0">flurry</h1> 
        </motion.div>
        
      </div>

      

      {/* <div className="flex flex-col gap-4 justify-center items-center h-screen p-4 font-inter text-center">
        <img 
          src={splash} 
          alt="someone using a phone" 
          className=""
        />
        <h1 className="font-bold text-2xl ">
          Connect and make new friends with <span className="text-bluegradient text-3xl">flurry</span> chat app
        </h1>

        <p className="mb-4">
          Text and receive messages quickly with new acquittances
        </p>

        <Link to="/signin" className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-bluegradient transition-all">
          Get Started
        </Link>

      </div>      */}
    </>
  )
}
