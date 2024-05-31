import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

export const JobApplicationDetails = ({
  user,
}: {
  user: { name: string; cv: string }
}) => {
  return (
    <div className="container">
      <div>
        <div>
          <Dialog>
            <DialogTrigger>
              <Button>Open CV</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>CV of {user?.name}</DialogTitle>
                <DialogDescription>{user?.cv}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div>Pan No</div>
        <div>Message: </div>
        <div>View User Profile</div>
        <div>Accept</div>
        <div>Decline</div>
      </div>
    </div>
  )
}
