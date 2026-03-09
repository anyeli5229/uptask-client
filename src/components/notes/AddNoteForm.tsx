import { NoteFormData } from "@/types/index"
import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import { useLocation, useParams } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "@/api/NoteAPI"
import { toast } from "react-toastify"


export default function AddNoteForm() {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get("viewTask")!
    const params = useParams()
    const projectId = params.projectId!

    const initialValues: NoteFormData = {
        content: ""
    }
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: createNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })
    const handleAddNote = (formData: NoteFormData) => {
        const data = {projectId, taskId, formData}
        mutate(data)
        reset()
    }
    return (
        <form
            className="space-y-3"
            noValidate
            onSubmit={handleSubmit(handleAddNote)}
        >

            <div className="flex flex-col gap-2">
                <label htmlFor="content" className="font-bold">Crear nota</label>
                <input
                    type="text"
                    id="content"
                    placeholder="Contenido de las nota"
                    className="w-full p-3 border border-gray-300"
                    {...register('content', {
                        required: "Debes añadir el contenido de la nota"
                    })}
                />
                {errors.content && (
                    <ErrorMessage>{errors.content.message}</ErrorMessage>
                )}
            </div>

            <input
                type="submit"
                value='Crear nota'
                className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer mt-5"
            />
        </form>
    )
}
