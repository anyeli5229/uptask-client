import { updateProject } from "@/api/ProjectAPI";
import ProjectForm from "@/components/projects/ProjectForm";
import { Project, ProjectFormData } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type EditProjectFormProps = {
    data: ProjectFormData
    projectId: Project['_id']
}

export default function EditProjectForm({data, projectId} : EditProjectFormProps) {

    const navigate = useNavigate()

    const initialValues: ProjectFormData = {
        projectName: data.projectName,
        clientName: data.projectName,
        description: data.description
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {//data son las respuestas que se mandan desde el backend
            //Hace un nuevo refetch (Tú defines cuando), invalidando el query previo, para obtener un state sincronizado con los datos del servidor
            //Se invalida el query cada que hay un cambio en elgún proyecto
            queryClient.invalidateQueries({queryKey: ['projects']})
            queryClient.invalidateQueries({queryKey: ["editProject", projectId]})
            toast.success(data)
            navigate("/")
        }
    })

    const handleForm = (formData : ProjectFormData) => {
        const data = { //Los datos se le pasan como objetos ya que mutate sólo recibe 1
            projectId,
            formData
        }
        mutate(data)
    }
    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Actualizar proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para actualizar tu proyecto</p>

                <nav className="my-10">
                    <Link
                        className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-3xl font-bold cursor-pointer transition-colors"
                        to="/"
                    >Volver a proyectos</Link>
                </nav>

                <form className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate>

                    <ProjectForm
                        register={register}
                        errors={errors}
                    />

                    <input type="submit"
                        value="Guardar cambios"
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors" />
                </form>
            </div>
        </>
    )
}
