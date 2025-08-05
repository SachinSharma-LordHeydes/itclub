"use client";
import { GET_USER_ROLE } from "@/client/user/userQueries";
import { useQuery } from "@apollo/client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Menu, Monitor, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserDropdown } from "../clerk/UserDropdown";

const Navbar: React.FC = () => {
  const pathname = usePathname();

  const {
    data: userRoleData,
    loading: userRoleLoading,
  } = useQuery(GET_USER_ROLE);

  console.log("user role", userRoleData);

  let userRole;

  if (!userRoleLoading) {
    userRole = userRoleData.getUser.role;
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 ">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Monitor className="h-8 w-8" />
              <span className="font-bold text-xl">TechClub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.to)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div>
              <header className="flex justify-end items-center p-4 gap-4 h-16">
                <SignedOut>
                  <SignInButton />
                  <SignUpButton>
                    <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <UserDropdown userRole={userRole} />
                </SignedIn>
              </header>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className={`block px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div>
              <header className="flex justify-end items-center p-4 gap-4 h-16">
                <SignedOut>
                  <SignInButton />
                  <SignUpButton>
                    <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <UserDropdown userRole={userRole} />
                </SignedIn>
              </header>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
