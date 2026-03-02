import { useNavigate } from "react-router-dom"

import BtnCallToAction from "../../../components/btn/BtnCallToAction/BtnCallToAction"

export default function UserPreview({user, type}){

    const navigate = useNavigate();

    return(
        <div className="flex items-center gap-4 px-4 border-t border-slate-200 pt-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0"> 
                <img src={user.profilePic} className="h-full w-full object-cover rounded-full"/>
            </div>
            <div className="flex flex-1 min-w-0 flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col min-w-0">
                    <p className="font-semibold truncate">{user.name}</p>
                    {type === 'Profissionais' && <p className="truncate">{user.technology || "Sem tecnologias informadas"}</p>}
                    <p className="truncate">{user.city}, {user.uf}</p>
                    <p className="truncate">{user.followersCount} seguidor{user.followersCount > 1 && "es"}</p>
                </div>
                <div className="my-auto">
                    <BtnCallToAction onClick={() => navigate(`/profile/${type === 'Profissionais' ? 'professional' : 'company'}/${user.id}-${user.handle}`)}>
                        Visualizar Perfil
                    </BtnCallToAction>
                </div>
            </div>
        </div>
    )
}