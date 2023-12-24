import splash from "../assets/splash-assets/chat-logo17.png";

export default function SplashScreen() {
  return (
    <>
      <div className="bg-bluegradient flex flex-col gap-4 justify-center items-center h-screen">
         <img 
          src={splash} 
          alt="someone using a phone" 
          className="w-12 "
        /> 
        <h1 className="text-2xl font-inter font-bold text-white tracking-widest">flurry</h1> 


      </div>

    </>
  )
}
