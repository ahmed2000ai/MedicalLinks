import { Search, UserCircle, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { auth, signOut } from "@/auth"
import { NotificationBell } from "@/features/notifications/components/NotificationBell"

export async function Topbar() {
  const session = await auth()

  if (!session) return null

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      <div className="w-1/3 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search doctors, roles, or hospitals..." 
            className="pl-9 bg-background w-full"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {session.user?.id && <NotificationBell userId={session.user.id} />}
        <div className="flex items-center gap-2 border-l pl-4">
          <UserCircle size={28} className="text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">{session.user?.name || session.user?.email}</span>
            <span className="text-xs text-muted-foreground mt-1 capitalize">{session.user?.role?.toLowerCase()}</span>
          </div>
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}>
            <button className="ml-2 p-2 text-muted-foreground hover:text-destructive transition-colors" title="Sign Out">
              <LogOut size={20} />
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
