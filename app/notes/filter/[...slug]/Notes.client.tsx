// app/notes/notesClient.tsx

'use client';
import css from './NotesPage.module.css';

import { useState } from 'react';
import { getNotes, type GetNoteParams } from '@/lib/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

const PER_PAGE = 12;

function NotesClient({ initialParams }: { initialParams?: GetNoteParams }) {
  const [inputValue, setInputValue] = useState(initialParams?.search ?? '');
  const [searchQuery, setSearchQuery] = useState(initialParams?.search ?? '');
  const [currentPage, setCurrentPage] = useState(initialParams?.page ?? 1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params: GetNoteParams = {
    page: currentPage,
    perPage: initialParams?.perPage ?? PER_PAGE,
    search: searchQuery.trim() || undefined,
    ...(initialParams?.tag ? { tag: initialParams.tag } : {}),
  };

  const { data, isFetching } = useQuery({
    queryKey: ['notes', params],
    queryFn: () => getNotes(params),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  const handleSearch = (newQuery: string) => {
    setSearchQuery(newQuery);
    setCurrentPage(1);
  };

  const onSearchQueryChange = useDebouncedCallback(handleSearch, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={inputValue}
          onChange={value => {
            setInputValue(value);
            onSearchQueryChange(value);
          }}
        />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isFetching && <p className={css.loading}>Loading…</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

export default NotesClient;
