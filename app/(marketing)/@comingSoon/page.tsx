import { appDescription, appName } from "@/lib/constants"
import { NewsletterForm } from "../_components/newsletter-form"

export default function ComingSoonPage() {
  return (
    <section className="w-full border-y pb-8 pt-12 md:pt-24 lg:pt-32">
      <div className="space-y-10 px-4 md:px-6 xl:space-y-16">
        <div className="mx-auto grid max-w-[1300px] gap-4 px-4 sm:px-6 md:grid-cols-2 md:gap-16 md:px-10">
          <div>
            <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
              {appName}
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
              {appDescription}
            </p>
          </div>
          <div className="w-full max-w-sm space-y-4">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  )
}
