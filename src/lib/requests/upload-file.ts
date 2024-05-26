import { type APIResponse } from "@/types"

export const uploadFiles = async (
  files: File[] | FileList,
  { isProfile }: { isProfile?: boolean } = {}
) => {
  const formData = new FormData()

  if (files instanceof FileList) {
    for (const file of Array.from(files)) {
      formData.append("images", file)
    }
  } else {
    for (const file of files) {
      formData.append("images", file)
    }
  }

  if (isProfile) {
    formData.append("profile", "true")
  }

  try {
    const response = await fetch("/api/images/add", {
      method: "POST",
      credentials: "include",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload files")
    }

    const data = (await response.json()) as ImageUploadResponse
    console.log({ data })
    console.log(JSON.stringify(data))

    return data
  } catch (e) {
    throw e
  }
}

export type ImageUploadResponse = APIResponse<{
  images: {
    fileId: string
    url: string
    thumbnailUrl: string
    name: string
    size: number
  }[]
}>
