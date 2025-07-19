import BtnCallToAction from "../../../components/btn/BtnCallToAction/BtnCallToAction"

export default function UserPreview({user, type}){
    return(
        <div className="flex align-content-center px-4 border-t-1 pt-4 border-slate-200 mx-auto md:mx-0">
            <div className="relative w-full max-w-[85px] h-[85px] flex-shrink-0 my-auto mr-5"> 
                <img src={user.profilePic} className="h-full w-full object-cover rounded-full"/>
            </div>
            <div className="flex flex-col md:flex-row md:w-full justify-between">
                <div className="flex flex-col max-w-4/9">
                    <p className="font-semibold truncate">{user.name}</p>
                    {type === 'Profissionais' && <p className="truncate">{user.technology || "Sem tecnologias informadas"}</p>}
                    <p className="truncate">{user.city}, {user.uf}</p>
                    <p className="truncate">{user.followers} seguidor{user.followers > 1 && "es"}</p>
                </div>
                <div className="my-auto">
                    <BtnCallToAction>Visualizar Perfil</BtnCallToAction>
                </div>
            </div>
        </div>
    )
}