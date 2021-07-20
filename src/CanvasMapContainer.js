import {MapContainer} from 'react-leaflet';
import { connect } from 'react-redux';
import CanvasMap from "./CanvasMap";
import React, {useState} from "react";
import AutoFocusControl from "./AutoFocusControl";
import {addResource} from "mirador/dist/es/src/state/actions/catalog";

function CanvasMapContainer(props) {
    const [needsUpdate, setNeedsUpdate] = useState(false);
    const [zoom, setZoom] = useState(true);

    return (
        <MapContainer center={[0, 0]} zoom={1}>
            <CanvasMap manifests={props.manifests} windows={props.windows} setNeedsUpdate={setNeedsUpdate}
                       zoom={zoom}/>
            <AutoFocusControl zoom={zoom} setZoom={setZoom} addManifest={props.addResource}/>
        </MapContainer>
    );
}

const mapDispatchToProps = {
    addResource: addResource,
};

const mapStateToProps = function(state) {
    return {
        manifests: state.manifests,
        windows: state.windows
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasMapContainer)
