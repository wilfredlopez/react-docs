export function isAnyEmpty(values: string[]) {
    for (let s of values) {
        if (s.trim() === '') {
            return true
        }
    }
    return false
}