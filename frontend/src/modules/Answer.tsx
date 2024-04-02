import {FC, FormEventHandler, useEffect, useState} from 'react'
import {Navigation} from "@/components/Navigation.tsx";
import {observer} from "mobx-react-lite"
import {Textarea} from "@/components/ui/textarea.tsx";
import {QuestionStore} from "@/lib/list.stores.ts";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import UsersSelect from "@/components/UsersSelect.tsx";

const Answer: FC = () => {
    const [isSaving, setIsSaving] = useState<boolean>()
    const [saveError, setSaveError] = useState<string>()
    const params = useParams()
    const navigate = useNavigate()
    const isNew = params.answer_id === 'create'
    const questionId = params.question_id

    useEffect(() => {
        QuestionStore.fetch(import.meta.env.APPLICATION_BACKEND_URL + '/questions/' + questionId)

        if (isNew) return
        return () => {
            QuestionStore.reset()
        }
    }, [params.id])

    const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        setIsSaving(true)
        const formData = new FormData(event.currentTarget)
        const message = formData.get('message') as string
        const userId = formData.get('userId') as string

        const data = await fetch(import.meta.env.APPLICATION_BACKEND_URL + '/answers', {
            method: isNew ? 'POST' : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: params.id,
                questionId,
                message,
                userId
            })
        })

        const response = await data.json()
        if (!data.ok) {
            setSaveError(response.error)
            setIsSaving(false)
            return
        }

        navigate(`/questions`)
        setIsSaving(false)
    }

    return <main className="w-full h-full p-5 bg-[#252525]">
        <header className="pb-10">
            <Navigation/>
        </header>
        <div className="pb-2">
            <div className="flex items-start flex-col px-4">
                <label
                    htmlFor="title"
                    className="font-light text-xl">
                    Question
                </label>
                {QuestionStore.data?.title}
            </div>
            <div className="flex items-start flex-col px-4">
                <label
                    htmlFor="description"
                    className="font-light text-xl">
                    Description
                </label>
                {QuestionStore.data?.description}
            </div>
        </div>
        <form onSubmit={onSubmit} className="flex gap-4 flex-col border-none">
            <div className="flex items-start flex-col px-4">
                <label
                    htmlFor="message"
                    className="font-light text-xl">
                    Message
                </label>
                <Textarea
                    name="message"
                    id="message"
                    disabled={isSaving}
                    className="m-0 w-full"
                    required
                />
            </div>

            <div className="flex items-start flex-col px-4">
                <label
                    htmlFor="description"
                    className="font-light text-xl">
                    User
                </label>
                <UsersSelect
                    name="userId"
                    id="userId"
                    disabled={isSaving || !isNew}
                    className="m-0 w-full"
                    required
                />
            </div>

            <div className="flex items-start flex-col px-4 pt-4">
                <Button type="submit" className="bg-blue-300 rounded w-full flex justify-center" disabled={isSaving}>
                    {isNew ? 'Create' : 'Save'}
                </Button>
            </div>

            {saveError && <div className="flex items-start flex-col px-4 text-red-500">{saveError}</div>}
        </form>
    </main>
}

export default observer(Answer)
