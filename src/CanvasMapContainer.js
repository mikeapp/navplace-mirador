import {MapContainer} from 'react-leaflet';
import { connect } from 'react-redux';
import CanvasMap from "./CanvasMap";
import {useState} from "react";

function CanvasMapContainer(props) {

    const [needsUpdate, setNeedsUpdate] = useState(false);

    return (
        <MapContainer center={[0,0]} zoom={1} >
            <CanvasMap manifests={props.manifests} windows={props.windows} setNeedsUpdate={setNeedsUpdate} />
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
