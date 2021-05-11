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
            <div className={classes.ITEM}>

                <Link to="/me" className={"btn ".concat(` ` + classes.MenuBtn)}>My Documents</Link>
            </div>
            <div className={classes.ITEM}>

                <button
                    onClick={logout}
                    className={"btn ".concat(` ` + classes.Logout)} aria-label="logout" title="logout">
                    <span>Logout</span> <LogoutIcon width={20} />
                </button>
            </div>
        </div>
    )
}
