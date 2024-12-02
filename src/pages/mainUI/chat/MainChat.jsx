import { useEffect, useState } from 'react';
import Conversations from './Conversations';
import DirectChat from './DirectChat';

export default function MainChat({ userId }) {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleBack = () => {
    setSelectedConversation(null);
  };

  // const [windowSize, setWindowSize] = useState(null);
  const windowSize = window.innerWidth;
  console.log(windowSize);

  // useEffect(() => {
  //   setWindowSize(window.innerWidth);
  // }, [windowSize])

  const OutputChat = () => {
      if (!selectedConversation && windowSize <= 768) {
      return (
        <Conversations userId={userId} onSelectConversation={setSelectedConversation} />
      )
    } else if (selectedConversation && windowSize <= 768) {
      return (
        <DirectChat selectedConversation={selectedConversation} onBack={handleBack} />
      )
    } else {
      return (<>
        <Conversations userId={userId} onSelectConversation={setSelectedConversation} />
        <DirectChat selectedConversation={selectedConversation} onBack={handleBack} /> 
      </>)
    }
  };

  return (

    <div className=" flex flex-col md:flex-row h-screen">
      <OutputChat />
{/* <Conversations userId={userId} onSelectConversation={setSelectedConversation} />
<DirectChat selectedConversation={selectedConversation} onBack={handleBack} /> */}
      {/* <div className={`md:flex ${selectedConversation ? 'hidden md:flex' : 'flex'} md:w-1/3`}>
        <Conversations userId={userId} onSelectConversation={setSelectedConversation} />
      </div>
      <div className={`flex-1 ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
        <DirectChat selectedConversation={selectedConversation} onBack={handleBack} />
      </div> */}
    </div>
  );
}