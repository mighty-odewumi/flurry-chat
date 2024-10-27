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

    {/* User Image for now is just the first two letters of the user's name for now*/}
    {userImg && (
      <div className="rounded-full border-2 border-blue-300 bg-gray-100 flex items-center justify-center w-12 h-12">
        <span className="text-gray-700 font-semibold "
        >
          {userImg}
        </span>
      </div>
    )}

  </>
);

export default Avatar;
