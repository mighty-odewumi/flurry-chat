const ChatAvatar = ({ src, alt, className }) => (
    <div className="flex-shrink-0 mr-3">
        <img src={src} alt={alt} className={`rounded-full ${className}`} />
    </div>
);

export default ChatAvatar;