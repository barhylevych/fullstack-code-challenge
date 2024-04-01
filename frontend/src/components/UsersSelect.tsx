import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {FC, useContext, useEffect} from "react";
import {UsersStore} from "@/lib/list.stores.ts";
import {observer} from "mobx-react-lite";
import {UserContext} from "@/lib/user.context.ts";

interface ISelect {
    id?: string
    defaultValue?: string
    className?: string
    required?: boolean
    onChange?: (value: string) => void
    name?: string
    disabled?: boolean
}

const UsersSelect: FC<ISelect> = ({defaultValue, onChange, required, className, disabled, name, id}) => {
    const UsersStore = useContext(UserContext)

    useEffect(() => {
        UsersStore.fetch()
    }, [])

    return <Select onValueChange={onChange} defaultValue={defaultValue} name={name} disabled={disabled} required={required}>
        <SelectTrigger>
            <SelectValue id={id} className={className}/>
        </SelectTrigger>
        <SelectContent className="bg-gray-500">
            {UsersStore.data && UsersStore.data.map((user) => (
                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
            ))}
        </SelectContent>
    </Select>
}

export default observer(UsersSelect)
