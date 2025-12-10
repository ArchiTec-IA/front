import { LogoutIcon } from "@/assets/icons";
import { Avatar } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getInitials } from "@/lib/utils";
import { logout } from "@/store/authSlice";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

interface NavItensProps {
  isOpen?: boolean;
}

export function NavUser({ isOpen }: NavItensProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center bg-white p-3 rounded-lg  min-w-[50px]">
        {isOpen && (
          <>
            <Avatar className="h-10 w-10 flex items-center justify-center border-slate-300 border">
              {getInitials(user?.name)}
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight ml-3">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
          </>
        )}
        <Button
          variant={"ghost"}
          className="hover:cursor-pointer"
          onClick={handleLogout}
        >
          <LogoutIcon className="text-red-500 !h-5 !w-5" />
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
