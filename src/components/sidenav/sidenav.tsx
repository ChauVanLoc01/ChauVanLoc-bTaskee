'use client'

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { sideNavData } from './data';
import { usePathname } from 'next/navigation';

const SideNav = () => {
  const pathname = usePathname();

  return (
    <>
      {sideNavData.map((item) => (
        <Link
          href={item.href}
          key={item.href}
          className={cn('block p-4 hover:bg-gray-200 rounded-sm', {
            'bg-gray-200': pathname === item.href,
          })}
        >
          {item.content}
        </Link>
      ))}
    </>
  );
};

export default SideNav;
