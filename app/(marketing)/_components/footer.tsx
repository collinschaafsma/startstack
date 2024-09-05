import Image from "next/image"
import Link from "next/link"
import { appDescription, appName, twitterSite } from "@/lib/constants"
import LinkExternal from "@/components/link-external"
import Logo from "@/components/logo"
import ThemeToggle from "@/components/theme-toggle"
import NewsletterForm from "./newsletter-form"

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-12 dark:bg-gray-800">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <Logo className="size-6" />
            <span className="font-bold">{appName}</span>
          </Link>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {appDescription}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Quick Links</h3>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/account">Account</Link>
            </li>
            <li>
              <Link href="/legal/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/legal/terms-of-service">Terms of Service</Link>
            </li>
            <li>
              <Link href="/legal/license">License Agreement</Link>
            </li>
          </ul>
        </div>
        <NewsletterForm />
      </div>
      <div className="container mt-8 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div>
          <p>&copy; 2024 {appName}. All rights reserved.</p>
          <div className="mt-4">
            {twitterSite && (
              <LinkExternal
                href={twitterSite}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Image
                  src="/icons/x.svg"
                  alt="Twitter"
                  width={16}
                  height={16}
                />
                <span className="sr-only">Twitter</span>
              </LinkExternal>
            )}
          </div>
        </div>
        <ThemeToggle buttonClassName="bg-gray-100 dark:bg-gray-800" />
      </div>
    </footer>
  )
}
