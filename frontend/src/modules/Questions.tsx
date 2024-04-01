import {FC, useContext, useEffect} from 'react'
import {Navigation} from "@/components/Navigation.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Link} from "react-router-dom";
import { observer } from "mobx-react-lite"
import {QuestionsStore} from '../lib/list.stores.ts'
import {UserContext} from "@/lib/user.context.ts";

const Questions: FC = () => {
    const { isLoaded, isLoading, data  } = QuestionsStore
    const UsersStore = useContext(UserContext)

    const usersMap = new Map(UsersStore.data?.map((user) => [user.id, user.name]))

    useEffect(() => {
        QuestionsStore.fetch(import.meta.env.APPLICATION_BACKEND_URL + '/questions')
        UsersStore.fetch()
        return () => {
            QuestionsStore.reset()
        }
    }, [])

    const onDelete = async (id: string) => {
        await fetch(import.meta.env.APPLICATION_BACKEND_URL + '/questions/' + id, { method: 'DELETE' })
        QuestionsStore.fetch(import.meta.env.APPLICATION_BACKEND_URL + '/questions')
    }

    return <main className="w-full h-full p-5">
        <header className="pb-10">
            <Navigation/>
        </header>
        <div className="rounded-md border" hidden={!isLoaded  || isLoading}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data && data.map((question) => (
                        <TableRow key={question.id}>
                            <TableCell className="font-medium">{question.title}</TableCell>
                            <TableCell>{question.description}</TableCell>
                            <TableCell className="font-medium">{usersMap.get(question.userId)}</TableCell>
                            <TableCell>{new Intl.DateTimeFormat().format(new Date(question.createdAt))}</TableCell>
                            <TableCell>{new Intl.DateTimeFormat().format(new Date(question.editedAt))}</TableCell>
                            <TableCell className="text-right w-[100px]">
                                <Link
                                    to={`/questions/${question.id}/answers/create`}
                                    className="bg-blue-300 py-2.5 px-2.5 rounded w-full flex justify-center"
                                >
                                    Answer
                                </Link>
                            </TableCell>
                            <TableCell className="text-right w-[100px]">
                                <Link
                                    to={`/questions/${question.id}`}
                                    className="bg-blue-300 py-2.5 px-2.5 rounded w-full flex justify-center"
                                >
                                    Edit
                                </Link>
                            </TableCell>
                            <TableCell className="text-right w-[100px]">
                                <button
                                    onClick={() => onDelete(question.id)}
                                    className="bg-red-500 py-2.5 px-2.5 rounded w-full flex justify-center"
                                >
                                    Delete
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={7}></TableCell>
                        <TableCell className="text-right">
                            <Link to="/questions/create" className="bg-blue-300 py-2.5 px-2.5 rounded w-full flex justify-center">
                                Create
                            </Link>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    </main>
}

export default observer(Questions)
