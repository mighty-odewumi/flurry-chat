import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import chatLogo from "../assets/splash-assets/chat-logo18.png";
import splash from "../assets/splash-assets/splash1.jpg";


export default function SplashScreen() {


  return (
    <>
      <motion.div 
        className="bg-bluegradient flex flex-col gap-1 justify-center items-center h-screen"
        initial={{ transform: "translateX(100px)" }}
        animate={{ transform: "translateX(0px)" }}
        transition={{ type: "tween", stiffness: 50, delay: .25, ease: "easeIn", }}
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
