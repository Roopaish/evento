import { getServerAuthSession } from "@/server/auth"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import EditProfileForm from "@/components/user/edit-profile"

export default async function Profile() {
  const session = await getServerAuthSession()
  return (
    <>
      <div className="flex flex-col gap-4">
        <Text variant="large" bold>
          Edit Profile
        </Text>
        <Text>This information will appear on your public profile</Text>

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
        <EditProfileForm session={session} />
      </div>
    </>
  )
}
