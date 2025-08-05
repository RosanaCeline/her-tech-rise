import { useEffect, useState } from "react"
import { useQueryParams } from "../../services/useQueryParams"
import { searchUsers } from "../../services/searchService"
import BtnCallToAction from "../../components/btn/BtnCallToAction/BtnCallToAction"

import UserPreview from "./components/UserPreview"
import DetailedList from "./components/DetailedList"
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'

export default function SearchUser(){
    const query = useQueryParams()
    const [profissionais, setProfissionais] = useState([])
    const [empresas, setEmpresas] = useState([])
    const [currentList, setCurrentList] = useState('all')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
    const s = query.get('s')

    useEffect(() => {
        async function fetchUsers(){
            try{
                setLoading(true)
                const response = await searchUsers(s)
                setProfissionais(response.professionals)
                setEmpresas(response.companies)
            }catch(err){
                setError('Erro ao carregar detalhes de candidatura.');
                console.error(err);
            }finally{
                setLoading(false)
            }
            
        }
        fetchUsers()
    }, [s])

    if (loading) return ( <LoadingSpinner /> )
    if (error) return <main className="pt-34"><p className="text-red-600">{error}</p></main>;

    return(
        <main className='flex flex-col bg-(--gray) pt-34 pb-6'>
            {currentList === 'all'
            ? (<><SearchCard title="Profissionais" elements={profissionais} setCurrentList={setCurrentList}/>
                <SearchCard title="Empresas" elements={empresas} setCurrentList={setCurrentList}/></>)
            : <DetailedList type={currentList} query={s} setCurrentList={setCurrentList} />}
        </main>
    )
}

function SearchCard({title, elements, setCurrentList}){
    return(
        <article className='w-4/5 mx-auto bg-white p-8 rounded-xl shadow-md mb-4'>
            <p className="text-4xl font-semibold text-(--text-primary) pb-2 border-b-1">{title}</p>
            <div className="flex flex-col gap-y-4">
                {elements.length > 0 
                ? elements.map((user) => <UserPreview key={user.id} user={user} type={title}/>)
                : <p>Nenhum usuário foi encontrado</p>}
            </div>
            {elements.length == 6 &&
            <div className="flex justify-center">
                <BtnCallToAction variant="white" onClick={() => setCurrentList(title)}>Ver todos os resultados</BtnCallToAction>
            </div>}
        </article>
    )
}
