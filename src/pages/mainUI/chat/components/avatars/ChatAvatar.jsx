const ChatAvatar = ({ src, alt, className }) => (
    <img src={src} alt={alt} className={`w-8 h-8 rounded-full ${className}`} />
);

export default ChatAvatar;