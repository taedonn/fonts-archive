const defaultButton = {
    height: 28,
    marginTop: 0,
    marginBottom: 0,
}

interface Button {
    children: React.ReactNode,
    height?: number,
    marginTop?: number,
    marginBottom?: number,
}

export default function Button ({
    children,
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
            className="w-full flex justify-center items-center rounded-lg text-sm bg-h-1 hover:bg-h-0 text-white selection:bg-transparent"
        >
            {children}
        </div>
    )
}