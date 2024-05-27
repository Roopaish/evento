"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { EventType } from "@prisma/client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import type * as z from "zod"

import { cn } from "@/lib/utils"
import { type SearchFiltersSchema } from "@/lib/validations/search-filter-schema"

import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Checkbox } from "../ui/checkbox"
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
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
                          placeholder="Search title"
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
                    <FormLabel>Type</FormLabel>
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
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(EventType)?.map((type) => (
                            <SelectItem value={type.toLowerCase()} key={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start pl-3 text-left font-normal hover:scale-100 focus:scale-100",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="h-4 w-4 opacity-50" />

                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            // disabled={(date:Date) =>
                            //   date > new Date() || date < new Date("1900-01-01")
                            // }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <div className="relative mt-2">
                        <Icons.MapPin className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
                        <Input
                          {...field}
                          placeholder="Search address"
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
                name="hasJobOffers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Have Job Offers?</FormLabel>
                    <FormControl className="block">
                      <div className="flex items-center">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="ml-2">Yes</div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-auto">
                <Button type="submit" size="lg" className="w-full">
                  {prevPathname !== pathname && (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                  )}
                  Search
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
