export default function TimelineCard({children}){
    return (
        <div className="w-4/5 lg:w-1/2 mx-auto bg-white p-4 sm:p-8 rounded-xl shadow-md mt-8 mb-8 sm:mt-12 sm:mb-12">
            {children}
        </div>
    )
}