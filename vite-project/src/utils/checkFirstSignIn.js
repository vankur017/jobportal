
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { JOBAPI_URL } from "../constants/api";
import axios from "axios";


const checkFirstSignIn = async(uid)=>{
  
    try{
    const response = await fetch(`${JOBAPI_URL}/user/profile/${uid}`)

    if(!response.ok){
        console.log(`no profile data found`);
        
    }
    const data = await response.json()
    return data.exists === true
    }
    catch(error){
        console.error(`error while checking profile ${error}`)
        return false
    }


}

export default checkFirstSignIn