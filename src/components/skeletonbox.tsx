export default function SkeletonBox() {
    return (
        <>
            <div className='w-full p-8 border-b border-l-e'>
                <div className='animate-skeleton-anim bg-gradient bg-gradient-size w-20 h-7 mb-6 rounded-lg'></div>
                <div className='animate-skeleton-anim bg-gradient bg-gradient-size w-96 h-10 rounded-lg'></div>
            </div>
        </>
    )
}