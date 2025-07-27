import { useState } from "react"
import BtnCallToAction from "../../components/btn/BtnCallToAction/BtnCallToAction"
import ManageJob from "./components/ManageJob"
import PopUp from "../../components/PopUp"

export default function JobsListing(){
    const [manageJobModal, setManageJobModal] = useState(false)
    const [jobFormData, setJobFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        jobModel: '',
        salaryMin: '',
        salaryMax: '',
        contractType: '',
        jobLevel: '',
        applicationDeadline: ''
    })
    return(
        <main className='flex flex-col bg-(--gray) pt-34 pb-6'>
            <div className="flex justify-between items-center mb-6 w-5/6 p-6 bg-white mx-auto">
                <h2 className="text-4xl font-semibold text-[var(--purple-secundary)]">Minhas vagas publicadas</h2>
                <BtnCallToAction onClick={() => setManageJobModal(true)}>
                Nova Vaga
                </BtnCallToAction>
            </div>
            {manageJobModal && <PopUp><ManageJob setJobFormData={setJobFormData} jobFormData={jobFormData} setManageJobModal={setManageJobModal}/></PopUp>}
        </main>
    )
}