import { useState } from 'react'
import { CloseIcon } from './CloseIcon'
import { ElipsisIcon } from './ElipsisIcon'
import { Menu } from './Menu'

interface Props {
    // toggleMenu: () => boolean
    color?: string
}

export const UserMenu = ({ color = '#000' }: Props) => {
    const [showMenu, setShowMenu] = useState(false)


    function toggle() {
        setShowMenu(c => !c)
    }
    console.log("NOT BLACK", color !== '#000')
    return (
        <>
            <div
                //@ts-ignore
                white={String(color !== '#000')}
                className="fixed-logout">
                <button
                    onClick={toggle}

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
