import { makeAutoObservable } from "mobx"

class LoadStore<Data = unknown> {
    isLoaded = false
    isLoading = false
    isError = false
    data: Data | null = null
    error = null

    constructor() {
        makeAutoObservable(this)
    }

    fetch(url: string, options?: RequestInit) {
        this.isLoading = true
        fetch(url, options)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                this.data = data
                this.isLoaded = true
                this.isLoading = false
            })
            .catch((error) => {
                this.error = error
                this.isError = true
                this.isLoading = false
            })
    }

    reset() {
        this.isLoaded = false
        this.isLoading = false
        this.isError = false
        this.data = null
        this.error = null
    }
}

type IQuestion = {
    id: string;
    title: string;
    description: string;
    userId: string;
    createdAt: string;
    editedAt: string;
}

export const QuestionsStore = new LoadStore<IQuestion[]>()
export const QuestionStore = new LoadStore<IQuestion>()

type IAnswer = {
    id: string;
    message: string;
    userId: string;
    questionId: string;
    createdAt: string;
    editedAt: string;
}

export const AnswersStore = new LoadStore<IAnswer[]>()

type IUser = {
    id: string;
    name: string;
    createdAt: string;
}

export const UsersStore = new LoadStore<IUser[]>()
