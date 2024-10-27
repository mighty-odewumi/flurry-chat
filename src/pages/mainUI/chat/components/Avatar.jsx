// eslint-disable-next-line react/prop-types
const Avatar = ({ src, name, className, onClick, userImg }) => (
  <>
    {!userImg && (
      <div
        className={`rounded-full border-2 border-blue-500 overflow-hidden ${className}`}
        onClick={onClick}
      >
        {src && <img src={src} alt={name} className="w-full h-full object-cover" />}
      </div>
    )}

    {userImg && (
      <div className="flex items-center">
        <span className="ring-2 ring-secondaryblue rounded-full px-3 py-2 text-2xl font-bold "
        >
          {userImg}
        </span>
      </div>
    )}

  </>
);

export default Avatar;
