import { getUser } from "@/api/AuthAPI"
import { useQuery } from "@tanstack/react-query"

export const useAuth = () => {
    const token = localStorage.getItem('AUTH_TOKEN')
    
    const { data, isError, isLoading } = useQuery({

        queryKey: ["user"],
        queryFn: getUser,
        retry: false,
        enabled: !!token,
        refetchOnWindowFocus: false
    })

    return { data, isError, isLoading }
}