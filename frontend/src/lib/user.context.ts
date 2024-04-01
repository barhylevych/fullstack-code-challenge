import {UsersStore} from "@/lib/list.stores.ts";
import {createContext} from "react";

export const UserContext = createContext<typeof UsersStore & { fetch: () => ReturnType<typeof UsersStore['fetch']> }>({
    error: null,
    isError: false,
    isLoading: false,
    isLoaded: false,
    data: [] as any[],
    fetch: () => {},
    reset() {}
});
