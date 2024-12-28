import { Navigate, Outlet } from "react-router-dom";
import { Ultis } from "../../../common/Utils";

const checkToken = () => {
    const token = Ultis.getCookie('accessToken');
    if (token) return true;
    Ultis.clearCookie()
    return false;
}
  
const PrivateRoute = ({ children, redirect = "/login" } :{children?: any, redirect?: any} ) => {
    if(!checkToken()) return <Navigate to={redirect} replace />;

    return children ? children : <Outlet/>
};

export default PrivateRoute;
  