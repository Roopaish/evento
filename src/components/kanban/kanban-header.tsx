export default function KanbanHeader() {
  return (
    <div className="flex items-center">
      <input
        className="flex h-10 items-center rounded-full bg-gray-200 px-4 text-sm focus:outline-none focus:ring"
        type="search"
        placeholder="Search for anything…"
      />
      {/* <div className="ml-10">
        <a className="mx-2 text-sm font-semibold text-primary-700" href="#">
          Projects
        </a>
        <a
          className="mx-2 text-sm font-semibold text-gray-600 hover:text-primary-700"
          href="#"
        >
          Team
        </a>
        <a
          className="mx-2 text-sm font-semibold text-gray-600 hover:text-primary-700"
          href="#"
        >
          Activity
        </a>
      </div> */}
    </div>
  )
}
