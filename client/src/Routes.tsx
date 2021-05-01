import { Switch, Route, Redirect } from 'react-router-dom'
import { TextEditor } from './components/TextEditor'
import { v4 } from 'uuid'

export const Routes = () => {
    return (
        <Switch>
            <Route path="/" exact>
                <Redirect to={`/documents/${v4()}`} />
            </Route>

            <Route path="/documents/:id">
                <TextEditor />
            </Route>

        </Switch>
    )
}
