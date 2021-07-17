import React, { Component, lazy, Suspense } from 'react';
import { Provider } from 'react-redux'
import PropTypes from 'prop-types';
import PluginProvider from 'mirador/dist/es/src/extend/PluginProvider';
import AppProviders from 'mirador/dist/es/src/containers/AppProviders';
import createStore from 'mirador/dist/es/src/state/createStore';
import createRootReducer from 'mirador/dist/es/src/state/reducers/rootReducer';
import settings from 'mirador/dist/es/src/config/settings'
import * as actions from 'mirador/dist/es/src/state/actions'
import CanvasMap from "./CanvasMap";
import {MapContainer} from 'react-leaflet';
import CanvasMapContainer from "./CanvasMapContainer";

const WorkspaceArea = lazy(() => import('mirador/dist/es/src/containers/WorkspaceArea'));

/**
 * This is the top level Mirador component.
 * @prop {Object} manifests
 */
export class App extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount() {
        const store = createStore()
        settings.theme.palette.type = 'dark'
        store.dispatch(actions.setConfig(settings))
        store.dispatch(actions.setWorkspaceAddVisibility(true))
        this.setState({ store: store })
    }

    /**
     * render
     * @return {String} - HTML markup for the component
     */
    render() {
        const { dndManager, plugins } = this.props;
        return (
            <div>
                <Provider store={this.state.store} styleClass="mirador">
                    <PluginProvider plugins={plugins}>
                        <AppProviders dndManager={dndManager}>
                            <Suspense
                                fallback={<div />}
                            >
                                <WorkspaceArea />
                            </Suspense>
                        </AppProviders>
                    </PluginProvider>
                    <CanvasMapContainer />
                </Provider>
            </div>
        );
    }
}

App.propTypes = {
    dndManager: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    plugins: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

App.defaultProps = {
    dndManager: undefined,
    plugins: [],
};

export default App;