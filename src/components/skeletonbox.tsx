export default function SkeletonBox() {
    return (
        <div className='w-full p-8 tlg:px-4 tlg:py-6 border-b border-l-e dark:border-d-4'>
            <div className='w-full max-w-[6rem] tlg:max-w-full h-7 mb-6 tlg:mb-4 animate-skeleton-anim bg-gradient dark:bg-gradient-dark bg-gradient-size rounded-lg'></div>
            <div className='w-full max-w-md tlg:max-w-full h-10 animate-skeleton-anim bg-gradient dark:bg-gradient-dark bg-gradient-size rounded-lg'></div>
        </div>
    )
}