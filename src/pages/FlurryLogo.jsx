import { motion } from "framer-motion";
import chatLogo from "../assets/splash-assets/chat-logo18.png";

export default function FlurryLogo() {
  return (
    <>
      <motion.div
        initial={{ transform: "translateY(100px)" }}
        animate={{ transform: "translateY(0px)" }}
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

        <h1 className="text-3xl font-inter font-bold text-blue-500 tracking-widest mt-0">
          flurry
        </h1> 
      </motion.div>
    
    </>
  )
}
