import React, {FC} from "react";
import {observer} from "mobx-react-lite";
import {UsersStore} from '../lib/list.stores.ts'
import {UserContext} from '../lib/user.context.ts'

const UserStoreProvider: FC<{ children: React.ReactNode }> = ({children}) => {
    return <UserContext.Provider value={{
        ...UsersStore,
        fetch() {
            return UsersStore.fetch(import.meta.env.APPLICATION_BACKEND_URL + '/users/')
        },
        reset() {
            return UsersStore.reset()
        }
    }}>{children}</UserContext.Provider>
}

export default observer(UserStoreProvider)
