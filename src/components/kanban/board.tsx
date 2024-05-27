import TaskCard from "./task-card"

export default function Board({ title }: { title: string }) {
  return (
    <div className="m-2 border p-2">
      {title}
      <div>
        <TaskCard title="task 1" />
      </div>
    </div>
  )
}
