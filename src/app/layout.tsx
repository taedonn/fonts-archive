import './layout.css';

export const metadata = {
    title: 'FONTS ARCHIVE',
    description: 'A website that archives license-free Korean fonts',
}

export default function RootLayout({children,}: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <head>
                <link rel="shortcut icon" href="/favicon.svg"/>
            </head>
            <body>{children}</body>
        </html>
    )
}