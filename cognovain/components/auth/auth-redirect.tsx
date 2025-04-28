'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/ui/common/notification-provider';

export default function AuthRedirect() {
  const { showNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    // Show the notification that users can now try Cognovain
    showNotification("You're now signed in! Try Cognovain by submitting an entry.", 'success', 6000);
    
    // Redirect to home page using router.push
    router.push('/');
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); // Removed showNotification from dependencies to prevent infinite loop

  return null; // This component doesn't render anything
}