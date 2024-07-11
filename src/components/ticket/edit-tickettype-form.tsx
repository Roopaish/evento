import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  ticketFormSchema,
  type TicketFormSchema,
} from "@/lib/validations/ticket-form-validation"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Button } from "../ui/button"
import { Input } from "../ui/input"

export default function EditTicketForm({
  onCancel,
  ticketInfo,
}: {
  onCancel: () => void
  ticketInfo: RouterOutputs["ticket"]["getTicketInfoBySessionEventId"][0]
}) {
  const useUtils = api.useUtils()
  const { mutate: editticketInfo } = api.ticket.updateTicketInfo.useMutation()

  const form = useForm<TicketFormSchema>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      type: ticketInfo.ticketType,
      price: ticketInfo.price,
      color: ticketInfo.color,
      totalSeats: ticketInfo.totalSeats,
    },
  })

  const onSubmit = async (values: TicketFormSchema) => {
    editticketInfo(
      { ...values, ticketId: ticketInfo.id },
      {
        onSuccess: () => {
          void useUtils.ticket.getTicketInfoBySessionEventId.refetch()
        },
      }
    )
    onCancel()
  }

  return (
    <div className="m-2 p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Platinum" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. Rs. 500" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input
                    type="color"
                    {...field}
                    className="m-0 h-12 w-12 cursor-pointer border-none p-0"
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total seats</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="m-0 h-12 w-12 cursor-pointer border-none p-0"
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save changes</Button>
        </form>
      </Form>
    </div>
  )
}
