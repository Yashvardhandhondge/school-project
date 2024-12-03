// import { useToast } from "@/hooks/use-toast";
import { SideNav } from "@/Section/School/component/side-nav";
import { TeacherSideNav } from "@/Section/Teacher/component/side-nav";
import { TopNav } from "@/Section/School/component/top-nav";
import { Breadcrumb } from "@/Section/School/component/breadcrumb";
import { useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
// import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation(); // Get the current path
  const pathname = location.pathname;


  // Define routes for the simple layout
  const simpleLayoutRoutes = ['/', '/signup', '/signin','/students'];

  const isSimpleLayout = simpleLayoutRoutes.includes(pathname);
  const isTeacherLayout = pathname.startsWith('/teachers');
  if (isSimpleLayout) {
    return (
      <div>
        <Toaster />
        {children}
      </div>
    );
  }
  if (isTeacherLayout) {
    return (
      <div className="flex h-screen bg-gray-100">
      <TeacherSideNav />
      <Toaster />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Breadcrumb />
            {children}
          </div>
        </main>
      </div>
    </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav />
      <Toaster />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Breadcrumb />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
