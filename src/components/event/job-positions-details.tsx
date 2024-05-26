"use client"

import { type RouterOutputs } from "@/trpc/shared"

import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Separator } from "../ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Text } from "../ui/text"

export default function JobPositionsDetail({
  jobPositions,
}: {
  jobPositions: RouterOutputs["event"]["getEvent"]["jobPositions"]
}) {
  return (
    <div className={cn("container")}>
      <div className="flex flex-col border-2 py-2 ">
        {jobPositions.map((item) => (
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col" key={item.id}>
              <div className="border-b-2 border-primary-50 ">
                <Text variant={"h5"} className="mb-2">
                  {item.title}
                </Text>
                <Text variant={"small"}>{item.description}</Text>
              </div>
              <div className={" flex  items-center space-x-4 "}>
                <Text>Salary:&nbsp;{item.salary}</Text>
                <Separator orientation="vertical" className="h-5"></Separator>
                <Text>No. of Employee:&nbsp;{item.salary}</Text>
              </div>
            </div>
            <Dialog>
              <DialogTrigger>
                <Button>Apply</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply for {item.title}</DialogTitle>
                  <DialogDescription>
                    <div>Cv:</div>{" "}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  )
}
