import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link } from "react-router-dom";

const Page404 = () => {
    return (
        <div>
            <ErrorMessage/>
            <p>Page doesn't exist</p>
            <Link to='/'>Back to Main Page</Link>
        </div>
    )
}

export default Page404;