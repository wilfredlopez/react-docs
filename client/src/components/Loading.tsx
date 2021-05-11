import classes from './Loading.module.css'

export const Loading = () => {
    return (
        <div className={classes.LoadingContainer}>
            <div className={`${classes.Item} ${classes["One"]}`}></div>
            <div className={`${classes.Item} ${classes["Two"]}`}></div>
            <div className={`${classes.Item} ${classes["Three"]}`}></div>
            <div className={`${classes.Item} ${classes["Four"]}`}></div>
        </div>
    )
}
