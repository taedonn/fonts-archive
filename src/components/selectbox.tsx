// react
import { useEffect, useRef } from "react";

// libraries
import { throttle } from "lodash";

const defaultSelectBox = {
    height: 64
}

interface SelectBox {
    height?: number,
    title: string,
    icon: string,
    value: string,
    select: string,
    options: any,
    optionChange: any,
}

interface Option {
    value: string,
    name: string,
}

export default function SelectBox ({
    height=defaultSelectBox.height,
    title,
    icon,
    value,
    select,
    options,
    optionChange,
}: SelectBox) {
    const refSelect = useRef<HTMLLabelElement>(null);
    const refOption = useRef<HTMLDivElement>(null);

    // 셀렉트 박스 외 영역 클릭
    useEffect(() => {
        function handleClickOutside(e:Event) {
            const selectInput = document.getElementById(`select-${value}`) as HTMLInputElement;
            if (refSelect?.current && !refSelect.current.contains(e.target as Node) && refOption.current && !refOption.current.contains(e.target as Node)) {
                selectInput.checked = false;
            }
        }
        document.addEventListener("mouseup", handleClickOutside);
        return () => document.removeEventListener("mouseup", handleClickOutside);
    },[value, refOption]);

    /** 셀렉트 박스 클릭 */
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const label = document.getElementById(`label-${value}`) as HTMLLabelElement;
        const option = document.getElementById(`option-${value}-wrap`) as HTMLDivElement;

        // 넓이 계산 후 팝업 펼치기/접기
        const labelBottom = label.getBoundingClientRect().top + label.offsetHeight;
        const optionHeight = option.offsetHeight + 4;

        if (e.target.checked) {
            if (window.innerHeight <= (labelBottom + optionHeight)) {
                option.classList.remove("top-16");
                option.classList.add("animate-fade-in-from-top", "bottom-[68px]");
                setTimeout(function() {
                    option.classList.remove("animate-fade-in-from-top");
                }, 600);
            } else {
                option.classList.remove("bottom-[68px]");
                option.classList.add("animate-fade-in-account", "top-16");
                setTimeout(function() { option.classList.remove("animate-fade-in-account"); }, 600);
            }
        }
    }

    /** 선택된 영역 이름 */
    const fetchOptionName = (select: string) => {
        const fetchedOption = options.find((option: any) => option.value === select);
        return fetchedOption.name;
    }

    /** 옵션 선택 시 셀렉트 박스 해제 */
    const optionClose = () => {
        const input = document.getElementById(`select-${value}`) as HTMLInputElement;
        input.checked = false;
    }

    /** lodash/throttle을 이용해 스크롤 제어 */
    const throttledScroll = throttle(optionClose, 500);
    useEffect(() => {
        window.addEventListener('scroll', throttledScroll);
        return () => { window.removeEventListener('scroll', throttledScroll); }
    });

    return (
        <div className="custom-sm-scrollbar w-full relative">
            <input
                type="checkbox"
                id={`select-${value}`}
                onChange={handleChange}
                className="peer hidden"
            />
            <label ref={refSelect} htmlFor={`select-${value}`} id={`label-${value}`} style={{height: height + "px"}} className="group px-4 flex justify-between items-center rounded-lg border-2 cursor-pointer text-l-2 dark:text-white hover:bg-l-e hover:dark:bg-d-4 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent peer-checked:hover:bg-transparent border-transparent peer-checked:border-h-1 peer-checked:dark:border-f-8">
                <div className="flex items-center gap-3">
                    <i className={`text-lg bi ${icon}`}></i>
                    <span className="font-medium selection:bg-transparent">
                        {title}
                        <span className="ml-1 font-normal text-h-1 dark:text-f-8">[{fetchOptionName(select)}]</span>
                    </span>
                </div>
                <i className="peer-checked:group-[]:rotate-180 duration-100 fa-solid fa-angle-down"></i>
            </label>
            <div
                ref={refOption}
                id={`option-${value}-wrap`}
                style={{ height: options.length >= 5 ? '216px' : (options.length * 40 + 16) + 'px' }}
                className="custom-sm-scrollbar hidden peer-checked:block h-0 peer-checked:h-max w-full absolute z-10 left-0 mt-1 py-2 rounded-lg overflow-y-auto duration-100 bg-white dark:bg-d-4 drop-shadow-default dark:drop-shadow-dark"
            >
                {
                    options && options.map((option: Option) => {
                        return (
                            <div key={option.value} className="w-full text-sm">
                                <input
                                    type="radio"
                                    id={`option-${value}-${option.value}`}
                                    name={`option-${value}`}
                                    value={option.value}
                                    checked={select === option.value ? true : false}
                                    onChange={e => {
                                        optionChange(e);
                                        optionClose();
                                    }}
                                    className="peer hidden"
                                />
                                <label
                                    htmlFor={`option-${value}-${option.value}`}
                                    className="w-full px-5 py-2.5 block selection:bg-transparent cursor-pointer hover:bg-l-e hover:dark:bg-d-6 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent peer-checked:bg-h-e peer-checked:dark:bg-f-8 text-l-2 dark:text-white peer-checked:dark:text-d-2"
                                >
                                    {option.name}
                                </label>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}