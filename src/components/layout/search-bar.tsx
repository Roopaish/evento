"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { cn } from "@/lib/utils"
import { type SearchFiltersSchema } from "@/lib/validations/search-filter-schema"

import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Icons } from "../ui/icons"
import { Input } from "../ui/input"

export default function SearchBar({ className }: { className?: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const form = useForm<z.infer<typeof SearchFiltersSchema>>()

  useEffect(() => {
    if (searchParams) {
      form.setValue("q", searchParams.get("q") as unknown as string)
    }
  }, [searchParams])

  const onSubmit = (values: z.infer<typeof SearchFiltersSchema>) => {
    router.push(`/search?q=${values.q ?? ""}`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          `flex w-full items-center rounded-full border border-gray-300 px-4 lg:max-w-2xl`,
          className
        )}
      >
        <FormField
          control={form.control}
          name="q"
          render={({ field }) => (
            <FormItem className="flex-1 border-r">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Search by title"
                  className={
                    "w-full rounded-none border-none border-gray-300 px-4 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button className="flex items-center py-2 pl-2 lg:px-4" type="submit">
          <Icons.Search className="h-4 w-5 lg:mr-2" />
          <span className="hidden lg:block">Search</span>
        </button>
      </form>
    </Form>
  )
}
