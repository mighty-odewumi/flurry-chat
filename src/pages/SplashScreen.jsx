import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import chatLogo from "../assets/splash-assets/chat-logo18.png";
// import splash from "../assets/splash-assets/splash1.jpg";


// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  return null;
}

export default function SplashScreen() {

  const navigate = useNavigate();

  useEffect(() => {
    
    const timerID = setTimeout(() => {
      navigate("/conversations");
    }, 4000);
  
    return () => clearTimeout(timerID);
  }, [navigate])
  
  
  return (
    <>
      <div 
        className="bg-blue-500 flex flex-col gap-1 justify-center items-center h-screen"
      >
        <motion.div
          initial={{ opacity: 0, transform: "translateY(100px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ type: "spring", stiffness: 50, ease: "easeOut", }}
          className="flex flex-row justify-center items-center gap-2"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, repeatDelay: 1, duration: 2, ease: "easeIn" }}
          >
            <img 
              src={chatLogo} 
              alt="chat" 
              className="w-12 "
            />  
          </motion.div>

          <h1 className="text-3xl font-inter font-bold text-white tracking-widest mt-0">
            flurry
          </h1> 
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
