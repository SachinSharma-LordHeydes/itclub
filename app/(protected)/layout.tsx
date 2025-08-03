import { AppSidebar } from "@/components/protected/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ApolloProviderWrapper from "@/lib/apollo-wrapper";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="flex min-h-screen">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 flex flex-col bg-gray-50">
            <div className="bg-white shadow-black shadow-sm h-[45px] w-full items-center md:hidden flex sticky top-0 z-50">
              <SidebarTrigger className="w-12 h-12" />
            </div>

            <main className="flex-1 overflow-y-auto">
              <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default layout;
