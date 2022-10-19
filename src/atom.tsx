import { atom, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}
const TODOS_KEY = 'toDo';

const { persistAtom: toDoAtom } = recoilPersist({
  key: TODOS_KEY,
  storage: localStorage,
});

export const createBoardBoolean = atom<boolean>({
  key: 'createBoardBoolean',
  default: false,
});

export const todoState = atom<IToDoState>({
  key: TODOS_KEY,
  default: {},
  effects_UNSTABLE: [toDoAtom],
});
