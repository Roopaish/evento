import ImageKit from "imagekit"
import sharp from "sharp"

import { env } from "~/env"

const imageKit = new ImageKit({
  publicKey: env.IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
})

export async function uploadImages({
  images = [],
  // shouldWatermark = true,
}: {
  images: File[]
  shouldWatermark?: boolean
}) {
  try {
    const uploadedImages: {
      fileId: string
      url: string
      thumbnailUrl: string
      name: string
      size: number
    }[] = []
    // const watermarkPath = path.join(process.cwd(), "public", "watermark.png")

    await Promise.all(
      Array.from(images).map(async (imageFile) => {
        try {
          const arrayBuffer = await imageFile.arrayBuffer()
          const image = sharp(arrayBuffer)
            .resize({
              width: 1600,
              height: 900,
              fit: sharp.fit.cover,
            })
            .webp({
              quality: 70,
            })

          // if (shouldWatermark) {
          //   image = image.composite([
          //     {
          //       input: watermarkPath,
          //       gravity: "center",
          //     },
          //   ])
          // }

          const resizedImageBuffer = await image.toBuffer()

          const uploadResponse = await imageKit.upload({
            file: resizedImageBuffer,
            fileName: imageFile.name,
            folder: "/evento/",
          })

          uploadedImages.push({
            fileId: uploadResponse.fileId,
            url: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl,
            name: uploadResponse.name,
            size: uploadResponse.size,
          })
        } catch (error) {
          console.error(`Error uploading image ${imageFile.name}:`, error)
        }
      })
    )

    return uploadedImages
  } catch (e) {
    console.error("Error Occurred ", e)
    return []
  }
}

export async function deleteUploadedImages(fileIds: string[]) {
  try {
    await imageKit.bulkDeleteFiles(fileIds)
    return fileIds
  } catch (e) {
    console.log("Image kit delete error: ", e)
    return []
  }
}
