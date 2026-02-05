import Link from "next/link"
import { UserMenu } from "../dashboard/UserMenu"

export function Header() {
  return (
    <header id="nav-header" className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200 sticky top-0 z-40">
      <Link href="/dashboard" className="text-xl font-bold text-gray-800">
        WorkFlow
      </Link>
      <UserMenu />
    </header>
  )
}