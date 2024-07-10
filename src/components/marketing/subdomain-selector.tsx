import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { TemplateChosen } from "@prisma/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { subdomainSchema } from "@/lib/validations/subdomain-validation"

import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Icons } from "../ui/icons"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export const SubdomainSelector = () => {
  const { mutateAsync, isLoading } = api.subdomain.addSubDomain.useMutation({
    onSuccess() {
      toast.success("Website Generated")
    },
    onError: (e) => {
      toast.error(e.message ?? "Something went wrong")
    },
  })
  const form = useForm<z.infer<typeof subdomainSchema>>({
    resolver: zodResolver(subdomainSchema),
    defaultValues: {},
  })
  async function onSubmit(values: z.infer<typeof subdomainSchema>) {
    console.log("Reached Here")
    await mutateAsync({ ...values })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="route"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain: </FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          )}
        ></FormField>

        <FormField
          control={form.control}
          name="TemplateChosen"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Choose Template: </FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Select theme"
                          className="w-full"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(TemplateChosen).map((theme, index) => {
                        return (
                          <SelectItem value={theme} key={index}>
                            {theme}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )
          }}
        ></FormField>
        <Button className="mt-4" type="submit">
          {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
          Generate
        </Button>
      </form>
    </Form>
  )
}
