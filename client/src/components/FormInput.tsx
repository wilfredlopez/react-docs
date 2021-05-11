import React from 'react'

interface Props {
    value: string
    label: string
    autoComplete?: string
    type?: string
    id: string
    InputRef?: React.Ref<HTMLInputElement>
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
}

export const FormInput = ({ id, label, value, InputRef, autoComplete, type, onChange }: Props) => {
    return (
        (
            <div className="form-control input-underline full-width" key={id}>
                <div className="form-control">

                    <label htmlFor={id} className="label label-filled">{label}</label>
                </div>
                <div className="form-control">

                    <input
                        ref={InputRef}
                        type={type}
                        autoComplete={autoComplete}
                        value={value}
                        onChange={onChange}
                        id={id} />
                </div>
            </div>
        )
    )
}
