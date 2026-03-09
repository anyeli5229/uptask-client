import { getTaskById } from "@/api/TaskAPI"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"
import EditTaskModal from "./EditTaskModal"


export default function EditTaskData() {

    const params = useParams()
    const projectId = params.projectId!
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get("editTask")!

    const { data, isError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({ projectId, taskId }),
        enabled: !!taskId //enabled hace que se ejecute el useQuery bajo alguna condición, en este caso con -> !!taskId, cuando hay doble signo de interrogacíon, hace que la variable se convierta en un boolean dependiendo de si tiene o no valor
        //Esto se hace porque no siempre se va a tener esa variable en la url, y esto evita que se tenga que verificar si existe el valor en la url y entonces montar este componente en ProjectDetailsView, únicamente se monta y se ejecutan las funciones si existe el id de task en la url y así es como se muestra el modal para editar la tarea
    })

    if(isError) return (<Navigate to="/404"/>)

    if (data) return (<EditTaskModal data={data} taskId={taskId} />)
}
