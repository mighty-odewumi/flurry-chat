const ChatAvatar = ({ src, alt, className }) => (
    <img src={src} alt={alt} className={`rounded-full ${className}`} />
);

export default ChatAvatar;