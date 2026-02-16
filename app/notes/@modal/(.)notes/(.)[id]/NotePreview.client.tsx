'use client';

import css from './NotePreview.module.css';
import { getNoteById } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';

interface NotePreviewClientProps {
  id: string;
}

function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();
  const close = () => router.back();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => getNoteById(id),
    refetchOnMount: false,
  });

  const date = note?.updatedAt
    ? `Updated at: ${note.updatedAt}`
    : `Created at: ${note?.createdAt}`;

  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <Modal onClose={close}>
      <button type="button" onClick={close} className={css.backBtn}>
        Close
      </button>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note?.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{date}</p>
      </div>
    </Modal>
  );
}

export default NotePreviewClient;
