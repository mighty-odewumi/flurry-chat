import { useEffect, useState } from 'react';
import Conversations from './Conversations';
import DirectChat from './DirectChat';

export default function MainChat({ userId }) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const handleBack = () => {
    setSelectedConversation(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        return (
          <>
            <Conversations userId={userId} onSelectConversation={setSelectedConversation} />
            <DirectChat selectedConversation={selectedConversation} onBack={handleBack} /> 
          </>
        )
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <OutputChat />
    </div>
  );
}
