const NewUsersLoader = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        {[...Array(5)].map((_, index) => {
          return (
            <>
              <div key={index} className="flex flex-col items-center space-y-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
            </>
          )
        })}
      </div>
    </>
  )
}

export default NewUsersLoader;
