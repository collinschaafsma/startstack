import { cn } from "@/lib/utils"

/**
 * Link External Component
 *
 * This component is used to render an external link.
 * It wraps the anchor tag and adds some default styles and attributes.
 *
 * @param {string} href - The URL to link to.
 * @param {React.ReactNode} children - The content to display inside the link.
 * @param {string} className - Additional class names to apply to the link.
 * @param {React.AnchorHTMLAttributes<HTMLAnchorElement>} props - The props for an anchor tag.
 */

export default function LinkExternal({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "pointer-events-none underline-offset-4 hover:underline lg:pointer-events-auto",
        props.className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
