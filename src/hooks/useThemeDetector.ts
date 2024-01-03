import { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';

const useThemeDetector = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [, setCookie] = useCookies<string>([]);

    // 유효기간 1년
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);

    useEffect(() => {
        const darkModeMq = window.matchMedia('(prefers-color-scheme: dark)');
        const handleDarkModeChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        }
        darkModeMq.addEventListener('change', handleDarkModeChange);
        setIsDarkMode(darkModeMq.matches);

        return () => darkModeMq.removeEventListener('change', handleDarkModeChange);
    }, []);

    if (isDarkMode) setCookie('theme', isDarkMode ? 'dark' : 'light', {path:'/', expires: expires, secure: true, sameSite: 'strict'});

    return isDarkMode;
}
export default useThemeDetector;