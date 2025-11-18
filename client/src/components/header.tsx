import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth";
import {
  Leaf,
  LogOut,
  User,
  Home,
  Map,
  Award,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoIcon from "@assets/generated_images/ReCicla+_app_logo_icon_c8ba0c8a.png";

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/">
            <a
              className="flex items-center gap-2 transition-transform hover:scale-105"
              data-testid="link-home"
            >
              <img src={logoIcon} alt="ReCicla+" className="h-8 w-8" />
              <span className="hidden font-bold text-lg tracking-tight md:inline-block">
                ReCicla<span className="text-primary">+</span> Angola
              </span>
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant={location === "/dashboard" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLocation("/dashboard")}
              data-testid="link-dashboard"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={location === "/collections" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLocation("/collections")}
              data-testid="link-collections"
            >
              <Map className="h-4 w-4 mr-2" />
              Recolhas
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user?.userType === "gerador" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setLocation("/new-collection")}
              data-testid="button-new-collection"
              className="hidden md:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Recolha
            </Button>
          )}

          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold cursor-pointer hover-elevate"
            onClick={() => setLocation("/profile")}
            data-testid="badge-points"
          >
            <Award className="h-4 w-4 text-primary" />
            <span>{user?.points || 0}</span>
            <span className="text-muted-foreground text-xs">pts</span>
          </Badge>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-user-menu"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium" data-testid="text-username">
                  {user?.fullName}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{user?.username}
                </p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {user?.userType === "gerador" ? "Gerador" : "Reciclador"}
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLocation("/profile")}
                data-testid="button-profile"
              >
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                data-testid="button-logout"
                className="text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
