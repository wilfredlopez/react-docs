import { RestHandler } from '../models/RestHandler'
import { LogoutIcon } from './LogoutIcon'
import { Link, useHistory } from 'react-router-dom'
import classes from './Menu.module.css'

interface Props {
    show: boolean
}

export const Menu = ({ show }: Props) => {
    const history = useHistory()
    function logout() {
        RestHandler.logout().then(() => history.push('/login'))
    }


    const menuClasses = show ? classes.Menu : classes.Menu + " " + classes.Hidden

    return (
        <div className={menuClasses}>
            <Link to="/me" className={"btn btn-sm".concat(` ` + classes.MenuBtn)}>My Documents</Link>
            <button
                onClick={logout}
                className={"btn btn-sm".concat(` ` + classes.Logout)} aria-label="logout" title="logout">
                <span>Logout</span> <LogoutIcon width={20} />
            </button>
        </div>
    )
}
