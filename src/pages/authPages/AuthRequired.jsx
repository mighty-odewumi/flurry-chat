import { Navigate } from "react-router-dom"


export default function AuthRequired() {
  return <Navigate to="/signin" />;
}
