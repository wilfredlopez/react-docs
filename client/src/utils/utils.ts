export function isAnyEmpty(values: string[]) {
    for (let s of values) {
        if (s.trim() === '') {
            return true
        }
    }
    return false
}

export function formatDate(time?: string) {
    return new Date(time || Date.now()).toLocaleDateString('en-us', {
        day: '2-digit',
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        year: "numeric"
    })
}

/**
 * Make inputs and labels work like Material Design.
 */
export function toggleLabelClassForInputs() {
    const labels = document.querySelectorAll('label')

    for (let i = 0; i < labels.length; i++) {
        const label = labels[i]
        const inputId = label.htmlFor
        const labelInput = document.querySelector(`input#${inputId}`) as HTMLInputElement | null
        if (labelInput) {
            labelInput.addEventListener('focus', () => {
                if (!labelInput.value) {

                    label.classList.add('label-shrink')
                    label.classList.remove('label-filled')
                }
            })
            labelInput.addEventListener('focusout', () => {
                if (!labelInput.value) {
                    label.classList.add('label-filled')
                    label.classList.remove('label-shrink')
                }
            })
            labelInput.addEventListener('change', () => {
                if (labelInput.value === '') {
                    label.classList.remove('hidden')
                } else {
                    label.classList.add('hidden')
                }
            })
        }

    }
}