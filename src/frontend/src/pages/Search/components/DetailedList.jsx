import { useEffect, useState } from "react"
import { searchProfessionals, searchCompanies } from "../../../services/searchService"
import { ChevronLeft, ChevronRight, Undo2, Ellipsis } from "lucide-react"
import UserPreview from './UserPreview'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'

export default function DetailedList({type, query, setCurrentList}){
    const [usersList, setUsersList] = useState([])
    const [countPages, setCountPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUsers(){
            try{
                setLoading(true)
                const response = (type === 'Profissionais') 
                ? await searchProfessionals(query, currentPage - 1) 
                : await searchCompanies(query, currentPage - 1)
                setUsersList(response.content)
                setCountPages(response.totalPages)
            }catch(err){
                setError('Erro ao carregar detalhes de candidatura.');
                console.error(err);
            }finally{
                setLoading(false)
            }
            
        }
        fetchUsers()
    }, [currentPage, query])

    if (loading) return ( <LoadingSpinner /> )
    if (error) return <main className="pt-34"><p className="text-red-600">{error}</p></main>;

    return(
        <>
        <section className='w-4/5 mx-auto bg-white p-8 rounded-xl shadow-md mb-4'>
            <button onClick={() => setCurrentList('all')} className="flex ml-auto mr-7 cursor-pointer transition duration-300 hover:-translate-x-1">
                <Undo2 className="mr-3"/>Voltar
            </button>

            <p className="text-4xl font-semibold text-(--text-primary) pb-2 border-b-1">{type}</p>

            <div className="flex flex-col gap-y-4">
                {usersList.length > 0 
                ? usersList.map((user) => <UserPreview key={user.id} user={user} type={type}/>)
                : <p>Nenhum usuário foi encontrado</p>}
            </div>
        </section>
        {countPages > 1 &&
        <div className="mt-4 px-8 my-4 py-3 flex justify-between text-(--purple-primary) w-4/5 mx-auto bg-white rounded-xl shadow-md">
            <button className={`flex my-auto
            ${currentPage > 1 ? 'cursor-pointer transition duration-300 hover:-translate-x-1' : 'text-(--font-gray)'}`}
            onClick={() => (currentPage > 1) && setCurrentPage(currentPage - 1)}>
                <ChevronLeft/>Voltar
            </button>
            <div className="flex gap-x-2 overflow-x-auto scrollbar-hide my-4">
                {Array.from({ length: countPages }, (_, i) => i + 1).map((page) => (
                    <PageButton key={page} page={page} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                ))}
            </div>
            <button className={`flex my-auto
            ${currentPage < countPages ? 'cursor-pointer transition duration-300 hover:translate-x-1' : 'text-(--font-gray)'}`}
            onClick={() => (currentPage < countPages) && setCurrentPage(currentPage + 1)}>
                Avançar<ChevronRight/>
            </button>
        </div>}
        </>
    )
}

function PageButton({page, setCurrentPage, currentPage}){
    return(
        <button key={page} onClick={() => setCurrentPage(page)} 
        className={`cursor-pointer min-w-10 h-10 rounded-full flex items-center justify-center 
        ${page === currentPage ? 'bg-(--purple-primary) text-white' : 'bg-(--gray)'}`}> 
            {page}
        </button>
    )
}