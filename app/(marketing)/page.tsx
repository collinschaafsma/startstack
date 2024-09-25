import Link from "next/link"
import { ChevronDownIcon } from "lucide-react"
import { appDescription, twitterSite } from "@/lib/constants"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { LinkExternal } from "@/components/link-external"
import { Products } from "./_components/products"

export default function Home() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                {appDescription}
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                Copy here
              </p>
            </div>
            <div className="space-x-4">
              <Link
                href="#pricing"
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                prefetch={false}
              >
                Get Started
              </Link>
              <Link
                href="#features"
                className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                prefetch={false}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full scroll-mt-28 py-12">
        <div className="container space-y-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Features
              </h2>
              <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Copy here
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-sm items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Feature 1</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptates, quibusdam.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Feature 2</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptates, quibusdam.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Feature 3</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptates, quibusdam.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="w-full scroll-mt-28 space-y-12 py-12">
        <Products />
      </section>

      <section id="faq" className="w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                FAQ
              </h2>
              <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Still have a question? Contact us on{" "}
                <LinkExternal href={twitterSite}>Twitter</LinkExternal>.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-2xl gap-6 py-12">
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-white px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-gray-300 dark:bg-gray-950 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-300">
                What is included?
                <ChevronDownIcon className="size-5 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pt-2 text-sm text-gray-500 dark:text-gray-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptates, quibusdam.
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-white px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-gray-300 dark:bg-gray-950 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-300">
                How do I get started?
                <ChevronDownIcon className="size-5 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pt-2 text-sm text-gray-500 dark:text-gray-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptates, quibusdam.
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </section>
    </>
  )
}
