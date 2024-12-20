import { useEffect, useRef, useState, forwardRef } from "react";
import { Link } from "react-router-dom";
import { LogOut, Search, User, Settings, } from "lucide-react";
import logOut from '../../../auth/logOut';


/* We can have a list of predefined avatars and have users choose from them first during signup */
const CurrentUser = ({onClick, className}) => (
  <div
    className={`cursor-pointer`}
    onClick={onClick}
  >
    <User className={`${className}`}/>
  </div>
);

// eslint-disable-next-line react/prop-types, react/display-name
const DropdownMenu = forwardRef(({handleLogoutClick}, ref,) => {
  return (
    <div 
      ref={ref} 
      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
    >
      <Link to={`/profile`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
        <Settings className="inline-block mr-2 h-4 w-4" />
        Profile Settings
      </Link>
      <button 
        className="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-400 w-full text-left bg-red-400"
        onClick={handleLogoutClick}     
      >
        <LogOut className="inline-block mr-2 h-4 w-4" />
        Logout
      </button>
    </div>
  )
});

export default function ConversationsHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

  const dropdownRef = useRef(null);

  const handleLogoutClick = () => {
    setShowLogoutPrompt(true);
  };

  const confirmLogout = () => {
    setShowLogoutPrompt(false);
    logOut();
  };

  const cancelLogout = () => {
    setShowLogoutPrompt(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick); // For PCs

    document.addEventListener("touchstart", handleOutsideClick); // For mobile devices

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);

      document.removeEventListener("touchstart", handleOutsideClick);
    };

  }, []);

  return(
    <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-blue-500">
      <h1 className="text-2xl text-white font-bold">flurry</h1>
      <div className="flex items-center space-x-2">
        {/* <Bell className="h-6 w-6 text- gray-600 text-white" /> */}
        {isSearchVisible ? (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search here..."
              className="w-full max-w-xs pl-10 pr-2 py-1 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              autoFocus
              onBlur={() => setIsSearchVisible(false)}
              onFocus={() => setIsDropdownOpen(false)}
            />
          </div>
          ) : (
            <button onClick={() => setIsSearchVisible(true)}>
              <Search className="h-6 w-6 text-white" />
            </button>
          )
        }
        <div className="relative" >
          <CurrentUser
            className="h-6 w-6 text-gr ay-600 text-white" 
            onClick={toggleDropdown}
          />
          {isDropdownOpen && <DropdownMenu 
            ref={dropdownRef}
            handleLogoutClick={handleLogoutClick}
          />}
        </div>

        {/* <button
          onClick={handleLogoutClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Logout
        </button> */}

        {showLogoutPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
              <p className="text-lg mb-4">Are you sure you want to log out?</p>
              <div className="flex justify-around">
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Yes, log out
                </button>
                <button
                  onClick={cancelLogout}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
