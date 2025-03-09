import {useAuth} from "../contexts/authContext";

export function AdminFeature({children}) {
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) return null;

    return children;
}