"use client"

import * as z from "zod"

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/config/constants"

export const zodImageUploadValidation = ({
  max = 5,
}: { max?: number; isRequired?: boolean } = {}) => {
  return z
    .custom<FileList>((val) => {
      console.log({ val })
      return val instanceof FileList || Array.isArray(val)
    }, "Please add images")
    .refine((files) => files.length > 0, `Please add images`)
    .refine(
      (files) => files.length <= max,
      `Maximum of ${max} images are allowed.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) => {
          return "url" in file ? true : file.size <= MAX_FILE_SIZE
        }),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          "url" in file ? true : ACCEPTED_IMAGE_TYPES.includes(file.type)
        ),
      "Only these types are allowed .jpg, .jpeg, .png and .webp"
    )
}
