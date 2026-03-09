import { getProjectById } from "@/api/ProjectAPI"
import EditProjectForm from "@/components/projects/EditProjectForm"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"


export default function EditProjectView() {
    const params = useParams()
    const projectId = params.projectId!
    
    const { data, isLoading, isError } = useQuery({
        queryKey: ["editProject", projectId],//Forma en la que se le da un key dinámico
        queryFn: () => getProjectById(projectId),//Se hace un arrow function para poder pararse datos como el id del proyecto
        retry: false //Sirve para que sólo haga una consulta en caso de que no encuentre el proyecto
    })

    if(isLoading) return "Cargando..."
    if(isError) return <Navigate to="/404" />
    if(data) return <EditProjectForm data={data} projectId={projectId}/>

}
