import { getFullProjectDetails } from "@/api/ProjectAPI"
import AddTaskModal from "@/components/tasks/AddTaskModal"
import EditTaskData from "@/components/tasks/EditTaskData"
import TaskList from "@/components/tasks/TaskList"
import TaskModalDetails from "@/components/tasks/TaskModalDetail"
import { useAuth } from "@/hooks/useAuth"
import { isManager } from "@/utils/policies"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Navigate, useNavigate, useParams, Link } from "react-router-dom"


export default function ProjectDetailsView() {
    const { data: user, isLoading: authLoading } = useAuth()
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ["project", projectId],//Forma en la que se le da un key dinámico
        queryFn: () => getFullProjectDetails(projectId),//Se hace un arrow function para poder pararse datos como el id del proyecto
        retry: false //Sirve para que sólo haga una consulta en caso de que no encuentre el proyecto
    })
    const canEdit = useMemo(() => data?.manager === user?._id, [data, user])
    if (isLoading && authLoading) return 'Cargando...'
    if (isError) return <Navigate to='/404' />
    if (data && user) return (
        <>
            <h1 className="text-5xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">
                {data.description}
            </p>
            {isManager(data.manager, user._id) && (
            <nav className="my-5 flex gap-3">
                <button className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl cursor-pointer transition-colors"
                    onClick={() => navigate('?newTask=true')}>Agregar tarea</button>

                <Link
                    to={'team'}
                    className="bg-fuchsia-600 bg-f hover:bg-fuchsia-700 px-10 py-3 text-white text-xl cursor-pointer transition-colors"
                >Colaboradores</Link>
            </nav>
            )}

            <TaskList
                tasks={data.tasks}
                canEdit={canEdit}
            />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )
}