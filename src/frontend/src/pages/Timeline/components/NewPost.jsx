import { useEffect, useState } from "react";
import LabelInput from "../../../components/form/Label/LabelInput";
import { getProfessionalProfile } from "../../../services/profileService";

export default function NewPost(){
    // solução temporária para conseguir a foto
    const [profileURL, setProfileURL] = useState('')

    useEffect(() => {
        async function getProfileURL() {
            const data = getProfessionalProfile(1)
            setProfileURL(data.profilePic)
        }
        getProfileURL()
    }, [])

    return (
        <>
            <div className="grid grid-cols-6">
                <img src={profileURL}></img>
                <div className="col-span-5">
                    <LabelInput placeholder="Comece uma nova publicação"/>
                </div>
            </div>
        </>
    )
}