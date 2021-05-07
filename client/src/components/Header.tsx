import { Link } from 'react-router-dom'
import { APP_TITLE } from '../constants'
import classes from './Header.module.css'

export const Header = () => {

    return (
        <header className={classes.Header}>
            <div className="container">

                <Link to="/me" className="unstyled-link">
                    <h1>
                        {APP_TITLE}
                    </h1>
                </Link>
            </div>
        </header>
    )
}
