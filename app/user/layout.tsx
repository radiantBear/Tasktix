import { authorize } from "@/lib/security/authorize";
import Sidebar from "./sidebar";

export default async function UserLayout({children}: Readonly<{children: React.ReactNode}>) {
  await authorize();

  return (
    <div className='flex h-100 grow'>
      <Sidebar />
      {children}
    </div>
  );
}