export default function SkeletonBox() {
    return (
        <div className='w-full p-8 tlg:px-4 tlg:py-6 border-b border-l-e dark:border-d-4'>
            <div className='animate-skeleton-anim bg-gradient dark:bg-gradient-dark bg-gradient-size w-full max-w-xs tlg:max-w-full h-7 mb-6 tlg:mb-4 rounded-lg'></div>
            <div className='animate-skeleton-anim bg-gradient dark:bg-gradient-dark bg-gradient-size w-full max-w-md tlg:max-w-full h-10 rounded-lg'></div>
        </div>
    )
}