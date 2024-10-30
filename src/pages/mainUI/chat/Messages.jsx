/* eslint-disable react/prop-types */
import ChatAvatar from "./components/avatars/ChatAvatar";
import { getTimeForMessage } from "../../../utils/dateTimeFormatting/getTimeForMessage";

// The avatar is normally supposed to be from the recipient user info that we'll obtain this for now, this works.
const Messages = ({msg, user, avatar}) => (
  <div 
    className={`flex ${msg.senderId === user?.uid  ? 'justify-end' : 'justify-start'} mb-4`}
    key={msg.id}
  >
    {!(msg.senderId === user?.uid) && avatar && (<ChatAvatar 
        src={avatar} 
        alt="Contact Avatar" 
        className="mr-2 h-8 w-8" 
      />)}
    <div className={`${msg.senderId === user?.uid  ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-2xl py-2 px-4 max-w-xs`}>
      <p>{msg.text}</p>
      <span className={`text-xs ${msg.senderId === user?.uid  ? 'text-blue-100' : 'text-gray-500'} block mt-1`}>{msg.timestamp && getTimeForMessage(msg.timestamp)}</span>
    </div>
  </div>
);

export default Messages;
