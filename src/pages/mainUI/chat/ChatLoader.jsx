const ChatLoader = () => {
  return (
    <div className="animate-pulse space-y-4 flex flex-col  ">
      {[...Array(3)].map((_, index) => {
        return (
          <>
            {/* Skeleton for received messages */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex flex-col space-y-2 items-end">
                <div className="h-4 bg-gray-400 rounded w-full"></div>
                <div className="h-4 bg-gray-400 rounded w-full"></div>  
                <div className="h-10 w-24 bg-transparent"></div>              
              </div>
            </div>

            {/* Skeleton for user's messages */}
            <div className="flex items-start justify-end space-x-3">
              <div className="flex flex-col space-y-2 items-end">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 w-24 bg-transparent"></div>
              </div>
            </div>
          </>
        )
      })}
    </div>
  )
}

export default ChatLoader;
