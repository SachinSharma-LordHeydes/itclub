"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { LayoutDashboard, LogOut, Settings, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const UserDropdown = ({ userRole }: { userRole: string }) => {
  const router = useRouter();

  const { signOut, openUserProfile } = useClerk();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          userRole === "admin"
            ? "text-red-600 bg-red-50 hover:bg-red-100"
            : "text-blue-600 bg-blue-50 hover:bg-blue-100"
        }`}
      >
        {userRole === "admin" ? (
          <Shield className="h-4 w-4" />
        ) : (
          <User className="h-4 w-4" />
        )}
        <span>{userRole === "admin" ? "Admin" : "User"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md z-50 overflow-hidden border border-gray-200">
          <button
            onClick={() => {
              openUserProfile();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
          >
            <Settings className="w-4 h-4" />
            Account Settings
          </button>

          <button
            className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-red-50"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
