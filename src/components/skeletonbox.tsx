export default function SkeletonBox() {
    return (
        <>
            <div className='w-[calc(20%-8px)] tlg:w-[calc(33.3%-6px)] tmd:w-[calc(50%-4px)] txs:w-full h-[18vw] tlg:h-[30vw] tmd:h-[46vw] txs:h-[82vw] p-[1.04vw] tlg:p-[1.95vw] tmd:p-[2.6vw] txs:p-[4.17vw] rounded-lg border border-theme-7 dark:border-theme-5'>
                <div className='animate-skeleton-anim bg-gradient dark:bg-gradient-dark bg-gradient-size w-[6.25vw] tlg:w-[11.72vw] tmd:w-[15.63vw] txs:w-[25vw] h-[1.25vw] tlg:h-[2.34vw] tmd:h-[3.13vw] txs:h-[5vw] mb-[0.42vw] tlg:mb-[0.78vw] tmd:mb-[1.04vw] txs:mb-[1.67vw] rounded-full bg-theme-3'></div>
                <div className='animate-skeleton-anim bg-gradient dark:bg-gradient-dark bg-gradient-size w-[4.17vw] tlg:w-[7.81vw] tmd:w-[10.42vw] txs:w-[16.67vw] h-[0.83vw] tlg:h-[1.56vw] tmd:h-[2.08vw] txs:h-[3.33vw] rounded-full bg-theme-3'></div>
                <div className="w-full h-px my-[0.83vw] tlg:my-[1.56vw] tmd:my-[2.08vw] txs:my-[3.33vw] bg-theme-7 dark:bg-theme-3"></div>
                <div className='animate-skeleton-anim bg-gradient dark:bg-gradient-dark bg-gradient-size w-full h-[8.33vw] tlg:h-[15.63vw] tmd:h-[20.83vw] txs:h-[33.33vw] rounded-lg bg-theme-3'></div>
            </div>
        </>
    )
}