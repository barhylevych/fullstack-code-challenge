import {FC, FormEventHandler, useEffect, useState} from 'react'
import {Navigation} from "@/components/Navigation.tsx";
import {observer} from "mobx-react-lite"
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {QuestionStore} from "@/lib/list.stores.ts";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import UsersSelect from "@/components/UsersSelect.tsx";

const Questions: FC = () => {
    const [isSaving, setIsSaving] = useState<boolean>()
    const [saveError, setSaveError] = useState<string>()
    const params = useParams()
    const navigate = useNavigate()
    const isNew = params.id === 'create'

    const {isLoaded, data, isError, error} = QuestionStore

    useEffect(() => {
        if (isNew) return

        QuestionStore.fetch(import.meta.env.APPLICATION_BACKEND_URL + '/questions/' + params.id)
        return () => {
            QuestionStore.reset()
        }
    }, [params.id])

    const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        setIsSaving(true)
        const formData = new FormData(event.currentTarget)
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const userId = formData.get('userId') as string

        const data = await fetch(import.meta.env.APPLICATION_BACKEND_URL + '/questions', {
            method: isNew ? 'POST' : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: params.id,
                title,
                description,
                userId
            })
        })

        const response = await data.json()
        if (!data.ok) {
            setSaveError(response.error)
            setIsSaving(false)
            return
        }

        navigate('/questions/' + response.id)
        setIsSaving(false)
    }

    return <main className="w-full h-full p-5 bg-[#252525]">
        <header className="pb-10">
            <Navigation/>
        </header>
        {
            (isNew || isLoaded) &&
            <form onSubmit={onSubmit} className="flex gap-4 flex-col border-none">
                <div className="flex items-start flex-col px-4">
                    <label
                        htmlFor="title"
                        className="font-light text-xl">
                        Title
                    </label>
                    <Input
                        name="title"
                        id="title"
                        defaultValue={data?.title}
                        className="m-0 w-full"
                        disabled={isSaving}
                        required
                    />
                </div>

                <div className="flex items-start flex-col px-4">
                    <label
                        htmlFor="description"
                        className="font-light text-xl">
                        Description
                    </label>
                    <Textarea
                        name="description"
                        id="description"
                        defaultValue={data?.description}
                        disabled={isSaving}
                        className="m-0 w-full"
                        required
                    />
                </div>

                <div className="flex items-start flex-col px-4">
                    <label
                        htmlFor="User"
                        className="font-light text-xl">
                        User
                    </label>
                    <UsersSelect
                        name="userId"
                        id="userId"
                        defaultValue={data?.userId || undefined}
                        disabled={isSaving || !isNew}
                        className="m-0 w-full"
                        required
                    />
                </div>

                <div className="flex items-start flex-col px-4">
                    <label
                        className="font-light text-xl">
                        Created
                    </label>
                    <Input
                        disabled
                        value={new Intl.DateTimeFormat().format(new Date(data?.createdAt ?? Date.now()))}
                    />
                </div>

                <div className="flex items-start flex-col px-4">
                    <label
                        className="font-light text-xl">
                        Updated
                    </label>
                    <Input
                        disabled
                        value={new Intl.DateTimeFormat().format(new Date(data?.editedAt ?? Date.now()))}
                    />
                </div>

                <div className="flex items-start flex-col px-4 pt-4">
                    <Button type="submit" className="bg-blue-300 rounded w-full flex justify-center" disabled={isSaving}>
                        {isNew ? 'Create' : 'Save' }
                    </Button>
                </div>

                {isError && <div className="flex items-start flex-col px-4 text-red-500">{error}</div>}
                {saveError && <div className="flex items-start flex-col px-4 text-red-500">{saveError}</div>}
            </form>
        }
    </main>
}

export default observer(Questions)
