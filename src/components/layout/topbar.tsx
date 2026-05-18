import { Search, UserCircle, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { auth, signOut } from "@/auth"
import { NotificationBell } from "@/features/notifications/components/NotificationBell"

export async function Topbar() {
  const session = await auth()

  if (!session) return null

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6">
      <div className="flex-1 min-w-0 mr-3 md:mr-0 md:w-1/3 md:min-w-[200px] md:flex-none">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="pl-9 bg-background w-full text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        {session.user?.id && <NotificationBell userId={session.user.id} />}
        <div className="flex items-center gap-2 border-l pl-2 md:pl-4">
          <UserCircle size={28} className="text-muted-foreground shrink-0" />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-medium leading-none truncate max-w-[120px]">{session.user?.name || session.user?.email}</span>
            <span className="text-xs text-muted-foreground mt-1 capitalize">{session.user?.role?.toLowerCase()}</span>
          </div>
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}>
            <button className="ml-1 md:ml-2 p-2 text-muted-foreground hover:text-destructive transition-colors" title="Sign Out">
              <LogOut size={20} />
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
