import { Author as AuthorType } from "@/features/auth/type";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type AuthorProps = {
  user: AuthorType | null;
};

export default function Author({ user }: AuthorProps) {
  if (!user) {
    return null;
  }
  return (
    <header className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 md:gap-2">
        <Avatar className="h-4 w-4 md:h-5 md:w-5">
          <AvatarImage src={user.image || undefined} alt="프로필 이미지" />
          <AvatarFallback className="text-xs font-semibold">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs font-medium">{user.name}</span>
      </div>
    </header>
  );
}
