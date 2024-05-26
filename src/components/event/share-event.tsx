"use client"

import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "next-share"
import { toast } from "sonner"

import { siteConfig } from "@/config/site"

import { Button } from "../ui/button"
import { Icons } from "../ui/icons"
import { Text } from "../ui/text"

export default function ShareEvent({ title }: { title?: string }) {
  const url = typeof window !== "undefined" ? window.location.href : ""

  return (
    <div className="mt-4 flex items-center gap-4 rounded border p-2">
      <Text variant="medium" semibold>
        Share with friends :
      </Text>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant={"ghost"}
          onClick={async () => {
            if (navigator.share) {
              try {
                await navigator.share({
                  title,
                  url,
                })
                toast.success("Link shared successfully")
              } catch (error) {
                console.log("Error sharing", error)
              }
            } else {
              await navigator.clipboard.writeText(url)
              toast.success("Link is copied to clipboard")
            }
          }}
        >
          <Icons.Link />
        </Button>

        <FacebookShareButton
          url={url}
          title={title}
          hashtag={`#${siteConfig.name}`}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <WhatsappShareButton
          url={url}
          title={title}
          hashtag={`#${siteConfig.name}`}
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>

        <TwitterShareButton
          url={url}
          title={title}
          hashtags={[`#${siteConfig.name}`]}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </div>
    </div>
  )
}
