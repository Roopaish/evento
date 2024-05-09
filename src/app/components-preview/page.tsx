import { Button } from "~/components/ui/button"
import { Icons } from "~/components/ui/icons"

const btnVariants = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
]
const btnSizes = ["icon", "sm", "default", "lg"]

export default function ComponentsPreviews() {
  return (
    <div className="container grid grid-cols-2 gap-10 pt-20 md:grid-cols-3 lg:grid-cols-4">
      {btnVariants.map((variant) =>
        btnSizes.map((size) => (
          <div key={`${variant}${size}`}>
            <Button
              key={size}
              variant={variant as "default"}
              size={size as "default"}
            >
              {size === "icon" ? (
                <Icons.Plus />
              ) : (
                <>
                  <Icons.Plus /> {variant.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        ))
      )}
    </div>
  )
}
