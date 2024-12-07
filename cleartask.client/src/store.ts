// File: store.d.ts
export interface StoreState {
    selListId: string | undefined;
    setSelListId: (id: string | undefined) => void;
}

declare const useStore: () => StoreState;
export default useStore;
