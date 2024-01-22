import { useState, useEffect } from "react"

const defaultTextArea = {
    onchange: (e: React.ChangeEvent<HTMLTextAreaElement>) => { return },
    stateMsg: [{ state: "", msg: "" }],
    state: "",
    value: "",
    disabled: false,
    tabindex: 1,
    autocomplete: "on",
    placeholder: "",
    label: "",
    isLabeled: true,
    marginTop: 0,
}

interface StateMsg {
    state: string,
    msg: string,
}

interface TextArea {
    onchange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    id: string,
    stateMsg?: Array<StateMsg>,
    state?: string,
    value?: string,
    disabled?: boolean,
    tabindex?: number,
    autocomplete?: string,
    placeholder?: string,
    label?: string,
    isLabeled?: boolean,
    marginTop?: number,
}

export default function TextArea ({
    onchange=defaultTextArea.onchange,
    id,
    stateMsg=defaultTextArea.stateMsg,
    state=defaultTextArea.state,
    value=defaultTextArea.value,
    disabled=defaultTextArea.disabled,
    tabindex=defaultTextArea.tabindex,
    autocomplete=defaultTextArea.autocomplete,
    placeholder=defaultTextArea.placeholder,
    label=defaultTextArea.label,
    isLabeled=defaultTextArea.isLabeled,
    marginTop=defaultTextArea.marginTop,
}: TextArea) {
    const returnMsg = (states: Array<StateMsg>) => {
        const obj = states.find((obj: StateMsg) => obj.state === state);
        return obj ? obj.msg : "";
    }

    const [thisState, setThisState] = useState<string>(state);
    const [thisStateMsg, setThisStateMsg] = useState<string>(returnMsg(stateMsg));
    useEffect(() => {
        function returnMsg(states: Array<StateMsg>) {
            const obj = states.find((obj: StateMsg) => obj.state === state);
            return obj ? obj.msg : "";
        }
        setThisState(state);
        setThisStateMsg(returnMsg(stateMsg));
    }, [state, stateMsg]);

    return (
        <>
            {
                isLabeled
                && <label htmlFor={id} style={{marginTop: marginTop + "rem"}} className='w-full flex justify-between items-center font-medium ml-px'>{label}</label>
            }
            <textarea
                onChange={onchange}
                defaultValue={value}
                disabled={disabled}
                id={id}
                tabIndex={tabindex}
                autoComplete={autocomplete}
                placeholder={placeholder}
                style={{marginTop: isLabeled ? "0.5rem" : marginTop + "rem"}}
                className={`custom-sm-scrollbar h-52 resize-none ${thisState === "" ? 'border-l-d dark:border-d-4 focus:border-h-1 focus:dark:border-f-8' : 'border-h-r focus:border-h-r'} ${isLabeled ? "mt-2" : ""} w-full text-sm px-3.5 py-3 rounded-lg border-2 placeholder-l-5 dark:placeholder-d-c bg-l-d dark:bg-d-4`}
            />
            {
                thisState !== ""
                && <div className="text-xs text-h-r mt-2 ml-4">{thisStateMsg}</div>
            }
        </>
    )
}