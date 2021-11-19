import {TileLayer, GeoJSON, Tooltip, useMap} from 'react-leaflet';
import L from 'leaflet';
import React, {useEffect, useState} from 'react';
import { bbox, featureCollection, bboxPolygon} from '@turf/turf';

const iconProps = {
    iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
}
const blueIcon = L.icon(iconProps);
const redIcon = L.icon({
    ...iconProps,
    className: "redIcon"
});
const blueMarker = (geoJsonPoint, latlng) => {
    return new L.Marker(latlng, {icon: blueIcon});
}
const redMarker = (geoJsonPoint, latlng) => {
    return new L.Marker(latlng, {icon: redIcon});
}

const geoJsonManifests = (manifests) => {
    return manifests.filter(m => !m.isFetching).filter(m => m?.json?.navPlace);
}

export default function CanvasMap(props) {
    const map = useMap();
    const [geojsonComponents, setGeojsonComponents] = useState([]);
    const [openManifests, setOpenManifests] = useState([]);
    // const [zoomGeoJson, setZoomGeoJson] = useState([]);
    const manifests = props.manifests;
    const windows = props.windows;

    const addNewWindow = (uri) => {
        let manifestIds = Object.values(windows).map(w => w.manifestId);
        if (!manifestIds.includes(uri)) {
            props.addWindow({manifestId: uri})
        }
    }

    const getLabel = (json) => {
        const label = json.label;
        return label[Object.keys(label)[0]];
    }

    // Update list of open Manifests
    useEffect(() => {
        if (Object.values(windows).length > 0) {
            const windowIds = Object.values(windows).map(w => w.manifestId);
            setOpenManifests(geoJsonManifests(Object.values(manifests)).filter(m => windowIds.includes(m.id)));
        } else {
            setOpenManifests([]);
        }

    }, [manifests, windows])

    // Map open manifests
    useEffect(() => {
        if (Object.values(manifests).length > 0) {
            const manifestList = geoJsonManifests(Object.values(manifests));
            if (manifestList.length > 0) {
                // Draw all on map
                const geojson = manifestList
                    .map(m => m.json.navPlace);
                const openManifestIds = openManifests.map(m => m.id);
                const highlightedPathStyle = {color: "red"}
                const newGeojsonComponents = geojson.map((data, index) => {
                    const currentManifestId = manifestList[index].id;
                    const highlight = openManifestIds.includes(currentManifestId);
                    const pointMarker = (highlight)? redMarker : blueMarker;
                    const pathStyle = (highlight)? highlightedPathStyle : null;
                    return (<GeoJSON
                        key={currentManifestId + ":" + highlight}
                        data={data}
                        eventHandlers={{
                            click: () => addNewWindow(manifestList[index].id)
                        }}
                        pointToLayer={pointMarker}
                        style={pathStyle}
                    >
                        <Tooltip>{getLabel(manifestList[index].json)}</Tooltip>
                    </GeoJSON>)
                });
                setGeojsonComponents(newGeojsonComponents);
            }
        }
    }, [manifests, windows, openManifests]);

    // Zoom map to contain geometry of open Manifests
    useEffect(() => {
        // Get region of interest and zoom map
        const zoomGeoJson = openManifests
            .filter(m => m.json.navPlace)
            .map(m => m.json.navPlace);
        if (props.zoom) {
            if (zoomGeoJson.length > 0) {
                const features = zoomGeoJson.map(json => bboxPolygon(bbox(json)));
                // console.log(features);
                const allBounds = bbox(featureCollection(features));
                // console.log(allBounds);
                map.fitBounds([[allBounds[1], allBounds[0]], [allBounds[3], allBounds[2]]]);
            } else {
                map.fitWorld();
            }
        }
    }, [props.zoom, map, openManifests])

   return (
       <>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
           {geojsonComponents}
       </>
   );
}