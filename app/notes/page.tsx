// // app/notes/page.tsx

import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { getNotes } from '@/lib/api';
import NotesClient from './filter/[...slug]/Notes.client';

export default async function Notes() {
  const queryClient = new QueryClient();

  const initialParams = { page: 1, perPage: 12, search: '' };

  await queryClient.prefetchQuery({
    queryKey: ['notes', initialParams],
    queryFn: () => getNotes(initialParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialParams={initialParams} />
    </HydrationBoundary>
  );
}
