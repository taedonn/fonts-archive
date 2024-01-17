const defaultButton = {
    color: "main",
    height: 3,
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
                height: height + "rem",
                marginTop: marginTop + "rem",
                marginBottom: marginBottom + "rem",
            }}
            className={`${color === "main" ? "bg-h-1 dark:bg-f-8  hover:bg-h-0 hover:dark:bg-f-9 tlg:hover:bg-h-1 tlg:hover:dark:bg-f-8 text-white dark:text-d-2" : color === "red" ? "bg-h-r hover:bg-h-r-h tlg:hover:bg-h-r text-white" : "bg-l-e dark:bg-d-4 hover:bg-l-d hover:dark:bg-d-6 tlg:hover:bg-l-e tlg:hover:dark:bg-d-4 text-l-2 dark:text-white"} w-full flex justify-center items-center rounded-lg selection:bg-transparent`}
        >
            {children}
        </div>
    )
}