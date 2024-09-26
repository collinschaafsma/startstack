import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Header } from "../_components/header"

export const metadata = {
  title: "Admin",
}

export default function AdminPage() {
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Header>
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <p>
          Your dashboard page here. Note that only a user with the admin role
          can access this page. Take a look at <code>middleware.ts</code> to see
          how this is enforced.
        </p>
      </main>
    </div>
  )
}
