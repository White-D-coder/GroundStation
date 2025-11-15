import { Rocket, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

export default function Header() {
  const userAvatar = PlaceHolderImages.find((p) => p.id === "user-avatar");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <nav className="flex-1">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold text-card-foreground"
        >
          <Rocket className="h-6 w-6 text-accent" />
          <span className="font-headline">Arduino Insights</span>
        </Link>
      </nav>
      
    </header>
  );
}
