import { NextResponse, type NextRequest } from "next/server"
import { authOptions } from "@/server/auth"
import { db } from "@/server/db"
import { uploadImages } from "@/server/utils/upload-image"
import { getServerSession } from "next-auth"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Please login first!",
      },
      { status: 401 }
    )
  }

  try {
    const formData = await request.formData()
    const images = formData.getAll("images") as File[]
    const isForProfile = Boolean(formData.get("profile") ?? "false")

    const uploadedImages = await uploadImages({
      images,
      // shouldWatermark: isForProfile ? false : true,
    })

    if (uploadedImages.length > 0) {
      await db.asset.createMany({
        data: uploadedImages.map((img) => {
          return {
            ...img,
            id: img.fileId,
            userId: session.user.id,
          }
        }),
      })

      return NextResponse.json(
        {
          message: isForProfile
            ? "Profile updated successfully!"
            : "Image/s uploaded successfully!",
          success: true,
          data: {
            images: uploadedImages,
          },
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: "Failed to upload images!", success: false },
        { status: 400 }
      )
    }
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: e ?? "Something went wrong!",
      },
      {
        status: 400,
      }
    )
  }
}
