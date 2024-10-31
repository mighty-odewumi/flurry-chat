const PreviousConversationsLoader = () => {
  return (
    <>
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => {
          return (
            <>
              <div key={index} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </>
          )
        })}
      </div>

      {/* <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
      </div> */}
    </>
  )
}

export default PreviousConversationsLoader;
