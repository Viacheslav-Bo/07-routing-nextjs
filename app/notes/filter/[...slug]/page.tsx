// app/notes/filter/[...slug]/page.tsx

import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { getNotes, type GetNoteParams } from '@/lib/api';
import { type NoteTag } from '@/types/note';
import NotesClient from './Notes.client';

interface NotesByCatgoryProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesByCategory({ params }: NotesByCatgoryProps) {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : (slug[0] as NoteTag);

  const initialParams: GetNoteParams = {
    page: 1,
    perPage: 12,
    ...(tag ? { tag } : {}),
  };

  const queryClient = new QueryClient();

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
