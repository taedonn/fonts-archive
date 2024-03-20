// components
import { onMouseDown, onMouseUp, onMouseOut } from "@/libs/common";

interface Sidemenu {
    children: React.ReactNode,
    expand: boolean,
    handleExpand: any,
    enableReset: boolean,
    handleReset: any,
}

export default function Sidemenu ({
    children,
    expand,
    handleExpand,
    enableReset,
    handleReset,
}: Sidemenu) {
    return (
        <div className={`${expand ? "w-80" : "w-0"} tlg:w-0 shrink-0 duration-200`}>
            <div className={`${expand ? "w-[calc(100%-320px)]" : "w-full"} tlg:w-full h-16 fixed z-10 top-16 right-0 duration-200`}>
                <div className="w-full h-full pl-8 tlg:pl-4 flex items-center bg-white dark:bg-d-2">
                    <input
                        type="checkbox"
                        id="expand-filter"
                        className="peer hidden"
                        onChange={handleExpand}
                        checked={expand}
                    />
                    <label htmlFor="expand-filter" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer bg-h-e dark:bg-d-3 hover:bg-h-1 hover:dark:bg-d-4 tlg:hover:bg-h-e tlg:hover:dark:bg-d-3 peer-checked:bg-h-1 peer-checked:dark:bg-f-8 tlg:peer-checked:bg-h-e tlg:peer-checked:dark:bg-d-3 peer-checked:hover:bg-h-0 peer-checked:hover:dark:bg-f-9 tlg:peer-checked:hover:bg-h-e tlg:peer-checked:hover:dark:bg-d-3 text-h-1 dark:text-f-8 hover:text-white tlg:hover:text-h-1 tlg:hover:dark:text-f-8 peer-checked:text-white peer-checked:dark:text-d-2 tlg:peer-checked:text-h-1 tlg:peer-checked:dark:text-f-8">
                        <i className="mr-1.5 bi bi-sliders2"></i>
                        필터
                    </label>
                    <button onClick={handleReset} className={`${
                        !enableReset
                            ? "text-l-b dark:text-d-6 hover:bg-transparent cursor-default"
                            : "text-h-1 dark:text-f-8 hover:bg-h-e hover:dark:bg-d-3 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent"
                        } ml-1.5 px-3 py-2 rounded-lg text-sm`}
                        onMouseDown={e => onMouseDown(e, 0.9, enableReset)} onMouseUp={onMouseUp} onMouseOut={onMouseOut}
                    >
                        <i className="mr-2 fa-solid fa-rotate-right"></i>
                        필터 초기화
                    </button>
                    <div className="w-full h-4 absolute left-0 -bottom-4 bg-gradient-to-b from-white dark:from-d-2"></div>
                </div>
            </div>
            <div className={`${expand ? "left-0" : "-left-80"} w-80 h-full fixed z-10 top-0 flex items-end duration-200`}>
                <div className="w-full h-[calc(100%-4rem)] pt-16 p-8 custom-sm-scrollbar relative overflow-y-auto bg-h-f dark:bg-d-3">
                    <div className="absolute right-8 top-3 flex items-center">
                        <button onClick={handleReset} className={`${
                            !enableReset
                                ? "text-l-b dark:text-d-6 hover:bg-transparent cursor-default"
                                : "text-h-1 dark:text-f-8 hover:bg-h-e hover:dark:bg-d-4 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent"
                            } mr-1 mt-0.5 px-3 py-2 rounded-lg text-sm`}
                            onMouseDown={e => onMouseDown(e, 0.9, enableReset)} onMouseUp={onMouseUp} onMouseOut={onMouseOut}
                        >
                            <i className="mr-2 fa-solid fa-rotate-right"></i>
                            필터 초기화
                        </button>
                        <input
                            type="checkbox"
                            id="expand"
                            className="hidden"
                            onChange={handleExpand}
                            checked={expand}
                        />
                        <label htmlFor="expand" onMouseDown={e => onMouseDown(e, 0.8, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="w-10 h-10 relative flex justify-center tlg:justify-end items-center text-3xl rounded-full cursor-pointer text-l-2 dark:text-white hover:bg-h-e hover:dark:bg-d-4 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent">
                            <i className="bi bi-x"></i>
                        </label>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}