import {FC, useEffect} from 'react'
import {Navigation} from "@/components/Navigation.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {observer} from "mobx-react-lite"
import {UsersStore} from '../lib/list.stores.ts'
import {Link} from "react-router-dom";

const Users: FC = () => {
    const {isLoaded, isLoading, data} = UsersStore

    useEffect(() => {
        UsersStore.fetch(import.meta.env.APPLICATION_BACKEND_URL + '/users')
        return () => {
            UsersStore.reset()
        }
    }, [])

    return <main className="w-full h-full p-5">
        <header className="pb-10">
            <Navigation/>
        </header>
        <div className="rounded-md border" hidden={!isLoaded || isLoading}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data && data.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{new Intl.DateTimeFormat().format(new Date(user.createdAt))}</TableCell>
                            <TableCell className="text-right w-[100px]">
                                <Link
                                    to={`/users/${user.id}/answers`}
                                    className="bg-blue-300 py-2.5 px-2.5 rounded w-full flex justify-center"
                                >
                                    Answers
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </main>
}

export default observer(Users)
