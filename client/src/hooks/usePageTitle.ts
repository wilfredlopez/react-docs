import { useEffect } from 'react'


export function usePageTitle(title: string) {
    useEffect(() => {
        window.document.title = title
    }, [title])
}

