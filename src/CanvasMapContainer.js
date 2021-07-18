import {MapContainer} from 'react-leaflet';
import { connect } from 'react-redux';
import CanvasMap from "./CanvasMap";
import {useState} from "react";
import AutoFocusControl from "./AutoFocusControl";

function CanvasMapContainer(props) {
    const [needsUpdate, setNeedsUpdate] = useState(false);
    const [zoom, setZoom] = useState(true);
    console.log("Rendering " + zoom);
    return (
        <MapContainer center={[0,0]} zoom={1} >
            <CanvasMap manifests={props.manifests} windows={props.windows} setNeedsUpdate={setNeedsUpdate} zoom={zoom} />
            <AutoFocusControl zoom={zoom} setZoom={setZoom} />
        </MapContainer>
    );
}

const mapStateToProps = function(state) {
    return {
        manifests: state.manifests,
        windows: state.windows
    }
}

export default connect(mapStateToProps)(CanvasMapContainer)
