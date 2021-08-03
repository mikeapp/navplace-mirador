import {MapContainer} from 'react-leaflet';
import { connect } from 'react-redux';
import CanvasMap from "./CanvasMap";
import React, {useEffect, useState} from "react";
import AutoFocusControl from "./AutoFocusControl";
import {addResource} from "mirador/dist/es/src/state/actions/catalog";
import {addWindow} from "mirador/dist/es/src/state/actions/window";

function CanvasMapContainer(props) {
    const [needsUpdate, setNeedsUpdate] = useState(false);
    const [zoom, setZoom] = useState(true);
    const prefix = window.location.origin ;

    useEffect(() => {
        props.addResource(prefix + "/manifests/navplace.json");
        props.addResource(prefix + "/manifests/recipe.json");
        props.addResource(prefix + "/manifests/1012.json");
        props.addResource(prefix + "/manifests/501.json");
        props.addResource(prefix + "/manifests/1011.json");
    });

    return (
        <MapContainer center={[0, 0]} zoom={1}>
            <CanvasMap manifests={props.manifests} windows={props.windows} addWindow={props.addWindow} setNeedsUpdate={setNeedsUpdate}
                       zoom={zoom}/>
            <AutoFocusControl zoom={zoom} setZoom={setZoom} addManifest={props.addResource}/>
        </MapContainer>
    );
}

const mapDispatchToProps = {
    addResource: addResource,
    addWindow: addWindow
};

const mapStateToProps = function(state) {
    return {
        manifests: state.manifests,
        windows: state.windows
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasMapContainer)
