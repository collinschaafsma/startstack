export default function LegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="container py-6 md:py-8">
      <div className="flex flex-col space-y-4">{children}</div>
    </div>
  )
}
