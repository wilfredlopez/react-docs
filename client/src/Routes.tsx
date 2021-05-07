import { Switch, Route, Redirect } from 'react-router-dom'
import { TextEditor } from './pages/TextEditor'
import { v4 } from 'uuid'
import { Login } from './pages/Login'
import { MyDocuments } from './pages/MyDocuments'

export const Routes = () => {
    return (
        <Switch>
            <Route path="/" exact>
                <Redirect to={`/documents/${v4()}`} />
            </Route>
            <Route path="/login" exact component={Login} />
            <Route path="/documents/:id">
                <TextEditor />
            </Route>
            <Route path="/me">
                <MyDocuments />
            </Route>
        </Switch>
    )
}
