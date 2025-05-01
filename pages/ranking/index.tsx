import { EmailAuthForm } from '@/components/auth/EmailAuthForm';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function RankingIndex() {
  const router = useRouter();
  const [isEmailAuthenticated, setIsEmailAuthenticated] = useState(false);
  if (!isEmailAuthenticated) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e] p-4">
            <EmailAuthForm
                onBack={() => window.history.back()} 
                onSuccess={() => setIsEmailAuthenticated(true)} 

            />

        </div>
        

    );

  }
  

  useEffect(() => {
    
    router.replace('/ranking/gamer');
  }, []);

  return null; 
}