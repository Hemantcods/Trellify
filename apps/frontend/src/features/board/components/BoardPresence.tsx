import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
type PresenceUser = {
  name: string;
};
type BoardPresenceProps = {
  users: PresenceUser[];
  connected: boolean;
};

function getInitial(name: string) {
  return (name ?? "").trim().charAt(0).toUpperCase() || "?";
}

export function BoardPresence({ users, connected }: BoardPresenceProps) {
  const visibleUsers = users.slice(0, 4);
  const remainingCount = Math.max(users.length - 4, 0);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center "
          aria-label="People viewing this board"
        >
          <div className="flex -space-x-2">
            {visibleUsers.map((user, index) => (
              <Avatar
                key={`${user.name}-${index}`}
                className="h-8 w-8 border-2 border-background"
              >
                <AvatarImage src="" alt={user.name} />

                <AvatarFallback>{getInitial(user.name)}</AvatarFallback>
              </Avatar>
            ))}

            {remainingCount > 0 && (
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarFallback>+{remainingCount}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">People viewing this board</h3>

            <p className="text-sm text-muted-foreground">
              {users.length} {users.length === 1 ? "person" : "people"}{" "}
              currently viewing
            </p>
          </div>

          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No other users are viewing this board.
              </p>
            ) : (
              users.map((user, index) => (
                <div
                  key={`${user.name}-${index}`}
                  className="flex items-center gap-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitial(user.name)}</AvatarFallback>
                  </Avatar>

                  <span className="text-sm">{user.name}</span>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 border-t pt-3">
            <span
              className={`h-2 w-2 rounded-full ${
                connected ? "bg-green-500" : "bg-red-500"
              }`}
            />

            <span className="text-xs text-muted-foreground">
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
