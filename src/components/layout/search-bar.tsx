import { Icons } from "../ui/icons"

export default function SearchBar() {
  return (
    <>
      <div className="flex w-full max-w-2xl flex-1 items-center rounded-full border border-gray-300 px-4">
        <input
          placeholder="Search Events"
          className="flex-1 border-r px-4 py-2 focus:outline-none "
        />
        <button className="flex items-center px-4 py-2 ">
          <Icons.Search className="mr-2 h-4 w-5"></Icons.Search>
          Search
        </button>
      </div>
    </>
  )
}
