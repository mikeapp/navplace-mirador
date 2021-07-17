import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import React from 'react';
import { connect } from 'react-redux';

function CanvasMap(props) {
    console.log(props.manifests);
    let geojson = [{
        "type": "Feature",
        "properties": {"label": "Hadleigh Castle is located here"},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [0.58, 51.54],
                [0.58, 51.55],
                [0.595, 51.55],
                [0.595, 51.54 ],
                [0.58, 51.54]
            ]]
        }
    }];

    const geojsonComponents = geojson.map((value, index) =>
            <GeoJSON
                key={index}
                data={geojson}
            ><Tooltip>Location {index}</Tooltip></GeoJSON> );

   return (
        <MapContainer center={[51.5444, 0.6]} zoom={12} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
           {geojsonComponents}
        </MapContainer>
   );
}

const mapStateToProps = function(state) {
    return {
        manifests: state.manifests
    }
}

export default connect(mapStateToProps)(CanvasMap)