import Link from "next/link"
import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"
import { zodResolver } from "@hookform/resolvers/zod"
import { type User } from "@prisma/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const ticketBookFormSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().min(1).max(100),
  PhoneNumber: z.string().min(10).max(10),
})

export default function TicketBookingForm({
  totalSeats,
  selectedTicket,
  user,
  onCancel,
}: {
  user: User
  totalSeats: number
  onCancel: () => void
  selectedTicket: RouterOutputs["ticket"]["getTicketInfo"][0]
}) {
  const form = useForm<z.infer<typeof ticketBookFormSchema>>({
    resolver: zodResolver(ticketBookFormSchema),
    defaultValues: {
      firstName: user?.name.split(" ")[0] ?? "",
      lastName: user?.name.split(" ")[1] ?? "",
      email: user?.email ?? "",
      PhoneNumber: user?.phoneNumber[0] ?? "",
    },
  })

  const { mutate: bookTicket } = api.ticket.bookTicketByForm.useMutation()
  const { mutate: bookingUserInfo } =
    api.ticket.bookingUserByFormInfo.useMutation()
  const onSubmit = async (values: z.infer<typeof ticketBookFormSchema>) => {
    console.log("formvalues", values)
    bookTicket(
      {
        ...selectedTicket,
        seats: Number(totalSeats),
      },
      {
        onSuccess: (data) => {
          console.log("data", data)
          bookingUserInfo({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: Number(values.PhoneNumber),
            ids: data.map((id) => Number(id)),
            eventId: selectedTicket.eventId,
          })
          onCancel()
          toast.success("Ticket booked successfully")
        },
      }
    )
  }

  return (
    <div className="m-2 border-gray-400 p-2 md:border-r-2">
      <div className="mb-3 text-2xl font-semibold">Billing information</div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-[50%]">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-[50%]">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="PhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mb-5 mt-5 flex flex-col gap-5">
              <div className="text-2xl font-semibold">Pay with</div>
              <div className="flex items-center gap-3">
                <div className="h-20 w-20 rounded-lg bg-green-500">Esewa</div>
                <div className="h-20 w-20 rounded-lg bg-purple-500">khalti</div>
              </div>
            </div>
            <div className="mb-4 mt-3">
              By selecting Place Order, I agree to the{" "}
              <Link href="#" className="font-medium underline">
                Evento Terms of Service
              </Link>
            </div>
            <Button
              // onClick={buyTicket}
              type="submit"
              size="default"
              className="mb-5 mt-5 w-full"
            >
              Place Order
            </Button>
            <div className="border-[1px] border-gray-300"></div>
            <div className="mt-2">
              Powered by{" "}
              <span className="font-medium text-gray-600">Evento</span>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
