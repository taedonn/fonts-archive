/** UTC에서 날짜만 반환 */
export function dateFormat(date: string) {
    const splitDate = date.split('-');
    return splitDate[0] + '-' + splitDate[1] + '-' + splitDate[2].split("T")[0];
}

/** UTC에서 날짜와 시간 반환 */
export function timeFormat(date: string) {
    function timeSplit(time: string) {
        const splitTime = time.split(':');
        return splitTime[0] + ':' + splitTime[1];
    }
    const splitDate = date.split('-');
    return splitDate[0].replace("20", "") + '.' + splitDate[1] + '.' + timeSplit(splitDate[2].replace('T', ' ').replace('Z', ''));
}

/** 문자열에서 숫자 추출 */
export function getIntFromString(string: string) {
    const regex = /[^0-9]/g;
    const result = string.replace(regex, '');
    return parseInt(result);
}

export function onMouseDown(e: React.MouseEvent, scale?: number) {
    const target = e.currentTarget as HTMLElement;
    if (target) target.style.transition = "0.2s";
    if (target) { if (scale) target.style.transform = `scale(${scale})`; }
}

export function onMouseUp(e: React.MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    if (target) target.style.transform = "scale(1)";
    if (target) target.style.transition = "0s";
}

export function onMouseOut(e: React.MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    if (target) target.style.transform = "scale(1)";
    if (target) target.style.transition = "0s";
}