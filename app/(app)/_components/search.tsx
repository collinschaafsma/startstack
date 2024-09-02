import { Search as SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Search() {
  return (
    <div className="relative ml-auto flex-1 md:grow-0">
      <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
    </div>
  )
}
