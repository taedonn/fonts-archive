const defaultTextArea = {
    onchange: (e: React.ChangeEvent<HTMLTextAreaElement>) => { return },
    tabindex: 1,
    autocomplete: "on",
    placeholder: "",
    focus: "",
    label: "",
    isLabeled: true,
    marginTop: 0,
}

interface TextArea {
    onchange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    id: string,
    tabindex?: number,
    autocomplete?: string,
    placeholder?: string,
    focus?: string,
    label?: string,
    isLabeled?: boolean,
    marginTop?: number,
}

export default function TextArea ({
    onchange=defaultTextArea.onchange,
    id,
    tabindex=defaultTextArea.tabindex,
    autocomplete=defaultTextArea.autocomplete,
    placeholder=defaultTextArea.placeholder,
    focus=defaultTextArea.focus,
    label=defaultTextArea.label,
    isLabeled=defaultTextArea.isLabeled,
    marginTop=defaultTextArea.marginTop,
}: TextArea) {
    return (
        <>
            {
                isLabeled
                && <label htmlFor={id} style={{marginTop: marginTop + "rem"}} className='w-full flex justify-between items-center font-medium ml-px'>{label}</label>
            }
            <textarea
                onChange={onchange}
                id={id}
                tabIndex={tabindex}
                autoComplete={autocomplete}
                placeholder={placeholder}
                style={{marginTop: isLabeled ? "0.5rem" : marginTop + "rem"}}
                className={`custom-sm-scrollbar h-52 resize-none ${focus === "" ? 'border-l-d dark:border-d-4 focus:border-h-1 focus:dark:border-f-8' : 'border-h-r focus:border-h-r'} ${isLabeled ? "mt-2" : ""} w-full text-sm px-3.5 py-3 rounded-lg border-2 placeholder-l-5 dark:placeholder-d-c bg-l-d dark:bg-d-4`}
            />
        </>
    )
}