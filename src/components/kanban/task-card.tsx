// export default function TaskCard({ title }: { title: string }) {
//   return <>{title}</>
// }

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const TaskCard = ({
  title,
  taskDetails,
  date,
}: {
  title: string
  taskDetails: string
  date: string
}) => {
  return (
    <div
      className="group relative m-3 flex cursor-pointer flex-col items-start rounded-lg bg-gray-200  p-4 hover:bg-opacity-100"
      draggable="true"
    >
      <span className="flex h-6 items-center rounded-full bg-pink-100 px-3 text-xs font-semibold text-pink-500">
        {title}
      </span>
      <h4 className="mt-3 text-sm font-medium">{taskDetails}</h4>
      <div className="mt-3 flex w-full items-center text-xs font-medium text-gray-400">
        <div className="flex items-center">
          <svg
            className="h-4 w-4 fill-current text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="ml-1 leading-none">{date}</span>
        </div>

        <Avatar className="ml-10 h-6 w-6 rounded-full">
          <AvatarImage
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
            className="object-cover"
          />
          <AvatarFallback>ABK</AvatarFallback>
        </Avatar>
      </div>
      <button className="absolute right-0 top-0 mr-4 mt-3  h-5 w-5 items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 group-hover:flex">
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
    </div>
  )
}

export default TaskCard
