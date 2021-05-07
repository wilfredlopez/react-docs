
interface Props {
    width?: number
    className?: string
    height?: number
    fill?: string
    color?: string
    strokeWidth?: number
}

export const ElipsisIcon = ({ width, className, height, fill = 'none', color = 'currentColor', strokeWidth = 2 }: Props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            className={className}
            width={width}
            height={height}
            fill={fill}
            viewBox="0 0 24 24" stroke={color}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
    )
}
