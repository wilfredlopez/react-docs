import { useState } from 'react'
import { CloseIcon } from './CloseIcon'
import { ElipsisIcon } from './ElipsisIcon'
import { Menu } from './Menu'

interface Props {
    color?: string
}



export const UserMenu = ({ color = '#000' }: Props) => {
    const [showMenu, setShowMenu] = useState(false)

    return (
        <>
            <div
                //@ts-ignore
                white={String(color !== '#000')}
                className="user-menu-layout"
                tabIndex={1}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        setShowMenu(c => !c)
                    }
                }}
            >

                <button

                    onClick={() => setShowMenu(c => !c)}
                    aria-label="menu" title="menu" className="btn-unstyled">

                    {showMenu ?
                        <CloseIcon color={color} height={25} />
                        :
                        <ElipsisIcon color={color} height={25} />
                    }
                </button>
            </div>
            <Menu show={showMenu} />
        </>
    )
}
