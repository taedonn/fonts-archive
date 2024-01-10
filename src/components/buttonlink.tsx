import Link from "next/link"

const defaultButtonLink = {
    height: 28,
    marginTop: 0,
    marginBottom: 0,
    onClick: () => {},
}

interface ButtonLink {
    children: React.ReactNode,
    height?: number,
    marginTop?: number,
    marginBottom?: number,
    href: string,
    onClick?: Function
}

export default function ButtonLink ({
    children,
    height=defaultButtonLink.height,
    marginTop=defaultButtonLink.marginTop,
    marginBottom=defaultButtonLink.marginBottom,
    href,
    onClick=defaultButtonLink.onClick,
}: ButtonLink) {
    return (
        <Link
            href={href}
            onClick={onClick()}
            style={{
                height: height + "px",
                marginTop: marginTop + "px",
                marginBottom: marginBottom + "px",
            }}
            className="w-full flex justify-center items-center rounded-lg text-sm bg-h-1 hover:bg-h-0 text-white selection:bg-transparent"
        >
            {children}
        </Link>
    )
}