import Image from "next/image"
import { currentUser } from "@/services/currentUser"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SignOutLink from "./sign-out-link"

export default async function Account() {
  const user = await currentUser()
  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Image
            src={user.image ?? "/placeholder-user.webp"}
            width={36}
            height={36}
            alt={user.name ?? "User Avatar"}
            loading="lazy"
            className="overflow-hidden rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutLink />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
