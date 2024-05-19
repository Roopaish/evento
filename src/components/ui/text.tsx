import { forwardRef, type HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textVariants = cva("whitespace-normal font-sans", {
  variants: {
    variant: {
      h1: "text-[56px] leading-[1.1] font-bold",
      h2: "text-5xl leading-[1.1] font-bold",
      h3: "text-[40px] leading-[1.1] font-bold",
      h4: "text-[32px] leading-[1.1] font-bold",
      h5: "text-2xl leading-[1.1] font-bold",
      h6: "text-xl leading-[1.1] font-semibold",
      large: "text-xl leading-[1.4]",
      medium: "text-lg leading-[1.4]",
      normal: "text-base leading-[1.4]",
      small: "text-sm leading-[1.4]",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
})

type TextElement = HTMLHeadingElement | HTMLParagraphElement

export interface TextProps
  extends HTMLAttributes<TextElement>,
    VariantProps<typeof textVariants> {
  bold?: boolean
  medium?: boolean
  semibold?: boolean
  as?: React.ElementType
}

const Text = forwardRef<TextElement, TextProps>(
  (
    {
      className,
      children,
      variant,
      medium,
      bold,
      semibold,
      as = "p",
      ...props
    },
    ref
  ) => {
    const fontWeightClass = bold
      ? "font-bold"
      : semibold
        ? "font-semibold"
        : medium
          ? "font-medium"
          : "font-normal"

    const Comp = as ? as : variant?.startsWith("h") ? (variant as "h1") : "p"

    return (
      <Comp
        ref={ref}
        className={cn(textVariants({ variant }), fontWeightClass, className)}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

Text.displayName = "Text"

export { Text, textVariants }
