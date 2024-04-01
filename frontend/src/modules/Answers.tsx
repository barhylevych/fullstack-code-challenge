import {FC, useContext, useEffect} from 'react'
import {Navigation} from "@/components/Navigation.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useParams} from "react-router-dom";
import { observer } from "mobx-react-lite"
import {AnswersStore} from '../lib/list.stores.ts'
import {UserContext} from "@/lib/user.context.ts";

const Answers: FC = () => {
    const params = useParams()

    const userId = params.user_id

    const { isLoaded, isLoading, data  } = AnswersStore
    const UsersStore = useContext(UserContext)

    const usersMap = new Map(UsersStore.data?.map((user) => [user.id, user.name]))

    useEffect(() => {
        AnswersStore.fetch(import.meta.env.APPLICATION_BACKEND_URL + '/answers/user/' + userId)
        UsersStore.fetch()
        return () => {
            AnswersStore.reset()
        }
    }, [])

    const onDelete = async (id: string) => {
        await fetch(import.meta.env.APPLICATION_BACKEND_URL + '/answers/' + id, { method: 'DELETE' })
        AnswersStore.fetch(import.meta.env.APPLICATION_BACKEND_URL + '/answers/user/' + userId)
    }

    return <main className="w-full h-full p-5">
        <header className="pb-10">
            <Navigation/>
        </header>
        <div className="rounded-md border" hidden={!isLoaded  || isLoading}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Message</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data && data.map((answer) => (
                        <TableRow key={answer.id}>
                            <TableCell className="font-medium">{answer.message}</TableCell>
                            <TableCell className="font-medium">{usersMap.get(answer.userId)}</TableCell>
                            <TableCell>{new Intl.DateTimeFormat().format(new Date(answer.createdAt))}</TableCell>
                            <TableCell>{new Intl.DateTimeFormat().format(new Date(answer.editedAt))}</TableCell>
                            <TableCell className="text-right w-[100px]">
                                <button
                                    onClick={() => onDelete(answer.id)}
                                    className="bg-red-500 py-2.5 px-2.5 rounded w-full flex justify-center"
                                >
                                    Delete
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </main>
}

export default observer(Answers)
