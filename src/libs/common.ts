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