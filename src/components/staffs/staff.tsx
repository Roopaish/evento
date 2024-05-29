const StaffRow = () => {
  return (
    <div className="relative mx-auto my-10 w-full max-w-screen-lg">
      <div className="absolute top-0 h-10 w-full bg-gray-200">
        <div className="flex h-full items-center space-x-10 px-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
            +
          </span>
          <span className="text-sm font-semibold text-gray-800 opacity-50">
            Name
          </span>
          <span className="text-sm font-semibold text-gray-800 opacity-50">
            Event title
          </span>
          <span className="text-sm font-semibold text-gray-800 opacity-50">
            Role
          </span>
          <span className="text-sm font-semibold text-gray-800 opacity-50">
            Email
          </span>
          <span className="text-sm font-semibold text-gray-800 opacity-50">
            Location
          </span>
        </div>
      </div>

      {/* Row */}
      <div className="absolute top-10 flex h-16 w-full items-center space-x-6 border-b border-gray-300 bg-white px-4">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-2 border-gray-400"
        />
        <div className="h-6 w-6 rounded-full bg-gray-400"></div>
        <span className="text-sm font-medium text-gray-800">
          Apsara Bishwokarma
        </span>
        <span className="text-sm text-gray-600">Github Session</span>
        <span className="text-sm text-gray-600">Manager</span>
        <span className="text-sm text-gray-600">apsarabk94@gmail.com</span>
        <span className="ml-auto text-sm text-gray-600"></span>
      </div>
    </div>
  )
}

export default StaffRow
