"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { EventType } from "@prisma/client"
import { useForm } from "react-hook-form"
import type * as z from "zod"

import { type SearchFiltersSchema } from "@/lib/validations/search-filter-schema"

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

export default function SearchFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const form = useForm<z.infer<typeof SearchFiltersSchema>>()
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams) {
      form.setValue("q", searchParams.get("q") as unknown as string)
    }
  }, [searchParams])

  useEffect(() => {
    setPrevPathname(pathname)
  }, [pathname])

  const createQueryString = useCallback(
    (values: z.infer<typeof SearchFiltersSchema>) => {
      const filteredValues = Object.fromEntries(
        Object.entries(values)
          .filter(
            ([_, value]) =>
              value !== undefined &&
              value !== null &&
              value !== "" &&
              value.toString().toLowerCase() !== "any"
          )
          .map(([key, value]) => [key, String(value)])
      )

      return new URLSearchParams(filteredValues).toString()
    },
    [searchParams]
  )

  const onSubmit = (values: z.infer<typeof SearchFiltersSchema>) => {
    router.push(`/search?${createQueryString(values)}`, {
      scroll: false,
    })
  }

  return (
    <div className="z-1 container relative z-10">
      <div className="grid grid-cols-1">
        <Form {...form}>
          <form
            className="rounded-xl bg-white p-6 shadow-md"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
              <FormField
                control={form.control}
                name="q"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search</FormLabel>
                    <FormControl>
                      <div className="relative mt-2">
                        <Icons.Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
                        <Input
                          {...field}
                          placeholder="Search"
                          className="pl-8"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <div className="relative mt-2">
                            <Icons.Box className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
                            <SelectTrigger className="pl-8">
                              <SelectValue placeholder="Select event category" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(EventType)?.map((category) => (
                            <SelectItem
                              value={category.toLowerCase()}
                              key={category}
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg">
                {prevPathname !== pathname && (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                )}
                Search
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
