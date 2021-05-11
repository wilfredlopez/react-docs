import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormInput } from './FormInput'


/**
 * Make inputs and labels work like Material Design.
 */
function toggleLabelClassForInputs() {
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

interface Props<T extends string> {
    initialState: FormValuesRecord<T>[]
    btnLabel: string
    error: string
    handleSubmit: (values: Record<T, string>, resetForm: () => void) => void
}

export interface FormValuesRecord<T extends string> {
    value: string
    label: string
    key: T,
    autoComplete?: string
    type?: string
    id: string
    InputRef?: React.Ref<HTMLInputElement>
}


export const FormLayout = <T extends string>({ initialState, btnLabel, error, handleSubmit }: Props<T>) => {
    const [formValues, setFormValues] = useState<Array<FormValuesRecord<T>>>(initialState)

    useEffect(() => {
        toggleLabelClassForInputs()

    }, [])


    const handleChange = useCallback(function handleChange(index: number, value: string) {
        setFormValues(actual => {
            const nf = [...actual]
            nf[index].value = value
            return [...nf]
        })
    }, [])

    const keyValue = useMemo(() => {
        return formValues.reduce((prev, current) => {
            return { ...prev, [current.key]: current.value }
        }, {} as Record<T, string>)
    }, [formValues])

    const formJSX = useMemo(() => {
        return [...formValues.entries()].map(([index, current]) => {
            return (
                <FormInput
                    label={current.label}
                    key={current.id}
                    InputRef={current.InputRef}
                    type={current.type}
                    autoComplete={current.autoComplete}
                    value={current.value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    id={current.id}
                />
            )
        })
    }, [formValues, handleChange])


    function resetForm() {
        setFormValues(initialState)
    }

    function _onSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()
        handleSubmit(keyValue, resetForm)
    }


    return (
        <form className="container container-sm" onSubmit={_onSubmit}>
            {formJSX}
            <div className="form-control form-actions">
                <div className="form-control error-text">
                    {error &&
                        <p className="form-error-inner">
                            {error}
                        </p>
                    }
                </div>
                <div className="form-control form-submit-btn">
                    <button className="btn small-space" type="submit">{btnLabel}</button>
                </div>
            </div>
        </form>
    )
}


