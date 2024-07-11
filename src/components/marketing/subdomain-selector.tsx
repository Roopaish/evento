"use client"

import { useEffect } from "react"
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
import { SubdomainDetails } from "./subdomain-details"

export const SubdomainSelector = () => {
  const form = useForm<z.infer<typeof subdomainSchema>>({
    resolver: zodResolver(subdomainSchema),
    defaultValues: {},
  })

  const { data, refetch } = api.subdomain.getEventDomain.useQuery()

  const { mutateAsync, isLoading } = api.subdomain.addSubDomain.useMutation({
    onSuccess() {
      toast.success(data ? "Updated data" : "Subdomain has been created!")
      void refetch()
    },
    onError: (e) => {
      toast.error(e.message ?? "Something went wrong")
    },
  })

  async function onSubmit(values: z.infer<typeof subdomainSchema>) {
    await mutateAsync({ ...values })
  }

  useEffect(() => {
    if (data) {
      form.setValue("route", data.route)
      form.setValue("TemplateChosen", data.templateChosen ?? "Template1")
    }
  }, [data])

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx max-w-[800px] space-y-4"
        >
          <FormField
            control={form.control}
            name="route"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subdomain</FormLabel>
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
            {data ? "Update" : "Generate"}
          </Button>
        </form>
      </Form>

      {data && (
        <div className="mt-5">
          <SubdomainDetails data={data}></SubdomainDetails>
        </div>
      )}
    </>
  )
}
