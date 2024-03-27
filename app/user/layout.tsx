import { ReactNode } from "react";

export default function UserLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div className='flex h-100 grow'>
      <aside className='w-48 bg-content1 p-4'>
        <NavItem value='List 1' />
      </aside>
      {children}
    </div>
  );
}

function NavItem({ value }: { value: ReactNode}) {
  return (
    <span className='pl-2 py-1 border-l-2 border-primary text-sm'>
      {value}
    </span>
  );
}