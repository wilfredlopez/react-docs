
interface Props {
    width?: number
    className?: string
    height?: number
    fill?: string
    color?: string
    strokeWidth?: number
}
export const CloseIcon = ({ width, className, height, fill = 'none', color = 'currentColor', strokeWidth = 2 }: Props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            className={className}
            width={width}
            height={height}
            fill={fill}
            viewBox="0 0 24 24"
            stroke={color}>
            <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={strokeWidth} d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}
