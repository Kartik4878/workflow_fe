export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {children}
    </div>
  )
}