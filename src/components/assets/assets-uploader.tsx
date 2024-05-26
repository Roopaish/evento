"use client"

import { useRef, type ElementRef } from "react"
import { type UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Icons } from "../ui/icons"

export default function AssetUploader({
  form,
  name,
  max,
}: {
  form: UseFormReturn
  name: string
  max?: number
}) {
  const inputRef = useRef<ElementRef<"input">>(null)

  const images = form.watch(name) as FileList

  return (
    <div>
      <FormField
        control={form.control}
        name={name}
        render={({ field: { onChange }, ...field }) => {
          return (
            <FormItem>
              <FormLabel></FormLabel>
              {/* File Upload */}
              <FormControl>
                <div className="mt-2 flex flex-wrap gap-2">
                  {images &&
                    Array.from(images || []).map((image, index) => {
                      const img = image as
                        | File
                        | { url: string; fileId: string }
                      const isURL = "url" in img

                      return (
                        <figure
                          key={index}
                          className="relative h-40 w-40 overflow-hidden rounded-sm border-2 border-primary"
                        >
                          <Button
                            type="button"
                            className="absolute right-2 top-2 "
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              if (isURL) {
                                const newImages = Array.from(
                                  images || []
                                ).filter((a) =>
                                  "fileId" in a ? a.fileId !== img.fileId : true
                                )
                                onChange(newImages)
                              } else {
                                const newImages = Array.from(
                                  images || []
                                ).filter((a, i) =>
                                  "url" in a ? false : i !== index
                                )
                                const otherImages = Array.from(
                                  images || []
                                ).filter((a) => "url" in a)
                                const dataTransfer = new DataTransfer()

                                if (newImages) {
                                  Array.from(newImages || []).forEach(
                                    (image) =>
                                      typeof image.name === "string"
                                        ? dataTransfer.items.add(image)
                                        : null
                                  )
                                }

                                const newFiles = dataTransfer.files
                                onChange([...otherImages, ...newFiles])
                              }
                            }}
                          >
                            <Icons.Trash className="h-4 w-4" />
                          </Button>
                          {image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              width={160}
                              height={160}
                              className="h-full w-full object-cover"
                              src={
                                isURL ? img?.url : URL.createObjectURL(image)
                              }
                              alt={"image"}
                            />
                          )}
                        </figure>
                      )
                    })}

                  <div
                    onClick={() => {
                      inputRef.current?.click()
                    }}
                    className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center space-y-2 overflow-hidden rounded-sm border-2 border-primary"
                  >
                    <Icons.PlusSquare className="h-8 w-8" />
                    <Label>Add images</Label>
                  </div>
                  <Input
                    {...field}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    multiple={true}
                    disabled={form.formState.isSubmitting}
                    ref={inputRef}
                    onChange={(event) => {
                      const dataTransfer = new DataTransfer()
                      const otherImages = Array.from(images || []).filter(
                        (a) => "url" in a
                      )

                      if (images) {
                        Array.from(images || []).forEach((image) =>
                          "url" in image ? null : dataTransfer.items.add(image)
                        )
                      }

                      console.log({ images })
                      console.log({ event: event.target.files })

                      Array.from(event.target.files! || []).forEach((image) =>
                        "url" in image ? null : dataTransfer.items.add(image)
                      )

                      const newFiles = dataTransfer.files
                      const changedImages = [...otherImages, ...newFiles]

                      if (!!max && changedImages?.length > max) {
                        toast.error(
                          `Maximum of ${max} file${
                            max === 1 ? "" : "s"
                          } can be selected`
                        )
                        return
                      }

                      onChange(changedImages)
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </div>
  )
}
