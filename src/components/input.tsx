const defaultInput = {
    onchange: (e: React.ChangeEvent<HTMLInputElement>) => { return },
    type: "text",
    tabindex: 1,
    autocomplete: "on",
    placeholder: "",
    focus: "",
    label: "",
    isLabeled: true,
    marginTop: 0,
}

interface Input {
    onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type?: string,
    id: string,
    tabindex?: number,
    autocomplete?: string,
    placeholder?: string,
    focus?: string,
    label?: string,
    isLabeled?: boolean,
    marginTop?: number,
}

export default function Input ({
    onchange=defaultInput.onchange,
    type=defaultInput.type,
    id,
    tabindex=defaultInput.tabindex,
    autocomplete=defaultInput.autocomplete,
    placeholder=defaultInput.placeholder,
    focus=defaultInput.focus,
    label=defaultInput.label,
    isLabeled=defaultInput.isLabeled,
    marginTop=defaultInput.marginTop,
}: Input) {
    return (
        <>
            {
                isLabeled
                && <label htmlFor={id} style={{marginTop: marginTop + "rem"}} className='w-full flex justify-between items-center font-medium ml-px'>{label}</label>
            }
            <input
                onChange={onchange}
                type={type}
                id={id}
                tabIndex={tabindex}
                autoComplete={autocomplete}
                placeholder={placeholder}
                style={{marginTop: isLabeled ? "0.5rem" : marginTop + "rem"}}
                className={`${focus === '' ? 'border-l-d dark:border-d-4 focus:border-h-1 focus:dark:border-f-8' : 'border-h-r focus:border-h-r'} ${isLabeled ? "mt-2" : ""} w-full text-sm px-3.5 py-3 rounded-lg border-2 placeholder-l-5 dark:placeholder-d-c bg-l-d dark:bg-d-4`}
            />
        </>
    )
}