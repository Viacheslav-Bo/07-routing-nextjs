import axios from 'axios';
import type { Note, NoteTag } from '@/types/note';

// ----------------------------------ENDPOINT---------------------------------------------
const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${myKey}`,
  },
});

// ----------------------------------GET-NOTES----------------------------------------------
export interface GetNoteParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
  totalItems: number;
}

export const getNotes = async (
  params: GetNoteParams = { page: 1, perPage: 12 }
): Promise<FetchNotesResponse> => {
  const res = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page: params.page,
      perPage: params.perPage,
      ...(params.search ? { search: params.search } : {}),
      ...(params.tag ? { tag: params.tag } : {}),
    },
  });
  return res.data;
};

// -----------------------------GET-NOTE-BY-ID----------------------------------------------
export const getNoteById = async (noteId: Note['id']): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${noteId}`);
  return data;
};

// ---------------------------------CREATE--------------------------------------------------
export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: NoteTag;
}

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const res = await api.post<Note>('/notes', payload);
  return res.data;
};

// ----------------------------------UPDATE-------------------------------------------------
export interface UpdateNotePayload {
  id: string;
  title?: string;
  content?: string;
  tag?: NoteTag;
}

export const updateNote = async ({
  id,
  ...patch
}: UpdateNotePayload): Promise<Note> => {
  const res = await api.patch<Note>(`/notes/${id}`, patch);
  return res.data;
};

// -----------------------------------DELETE------------------------------------------------
export const deleteNote = async (noteId: string) => {
  const res = await api.delete<Note>(`/notes/${noteId}`);
  return res.data;
};
