const defaultButton = {
    color: "main",
    height: 48,
    marginTop: 0,
    marginBottom: 0,
}

interface Button {
    children: React.ReactNode,
    color?: string,
    height?: number,
    marginTop?: number,
    marginBottom?: number,
}

export default function Button ({
    children,
    color=defaultButton.color,
    height=defaultButton.height,
    marginTop=defaultButton.marginTop,
    marginBottom=defaultButton.marginBottom,
}: Button) {
    return (
        <div
            style={{
                height: height + "px",
                marginTop: marginTop + "px",
                marginBottom: marginBottom + "px",
            }}
            className={`${color === "main" ? "bg-h-1 dark:bg-f-8  hover:bg-h-0 hover:dark:bg-f-9 text-white dark:text-d-2" : "bg-h-r hover:bg-h-r-h text-white"} w-full flex justify-center items-center rounded-lg selection:bg-transparent`}
        >
            {children}
        </div>
    )
}