import axios from "axios";

async function launch () {
    return await axios.get("https://api.nomadeducation.com/v2");
}

export default launch;
