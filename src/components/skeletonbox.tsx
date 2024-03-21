export default function SkeletonBox() {
    return (
        <div className='w-full px-4 lg:px-6 py-8 border-b border-l-d dark:border-d-4'>
            <div className='w-full h-8 mb-4 animate-skeleton-anim bg-gradient dark:bg-gradient-dark bg-gradient-size rounded-lg'></div>
            <div className='w-full h-12 animate-skeleton-anim bg-gradient dark:bg-gradient-dark bg-gradient-size rounded-lg'></div>
        </div>
    )
}