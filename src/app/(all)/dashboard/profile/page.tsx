import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import EditProfileForm from "@/components/user/edit-profile"

export default function Profile() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">Edit Profile</h1>
        <p>This information will appear on your public profile</p>
        <div className="flex items-center gap-6">
          <Avatar className="h-32 w-32">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex gap-4">
            <Button>Upload New</Button>
            <Button variant={"outline"}>Remove</Button>
          </div>
        </div>
        <EditProfileForm />
      </div>
    </>
  )
}
