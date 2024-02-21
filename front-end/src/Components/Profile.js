import { useParams } from "react-router-dom"
import Home from './Home';
import '../CSS/Profile.css';

function Profile() {
    const {uid} = useParams();
    return (
        <Home uid={uid}/>
    )
}
export default Profile;
