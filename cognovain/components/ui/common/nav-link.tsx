'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function NavLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Handle anchor links with smooth scrolling
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.substring(2);
      
      // Check if we're on the homepage
      if (pathname === '/') {
        // We're on the homepage, scroll to the element
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for header
            behavior: 'smooth'
          });
        }
      } else {
        // We're on a different page, navigate to homepage with the anchor
        window.location.href = href;
      }
      
      // Call the onClick handler if provided
      if (onClick) onClick();
    } else if (onClick) {
      onClick();
    }
  };
  
  return (
    <Link
      href={href}
      className={cn("transition-colors text-s text-gray-600 duration-200 hover:text-rose-500",
      className,
      isActive && 'text-rose-500'
    )}
    onClick={handleClick}
    >
      {children}
    </Link>
  );
}