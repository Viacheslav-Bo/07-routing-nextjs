'use client';

import { useRouter } from 'next/navigation';
import RouteModal from '@/components/Modal/Modal';

export default function ModalBack({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return <RouteModal onClose={() => router.back()}>{children}</RouteModal>;
}
