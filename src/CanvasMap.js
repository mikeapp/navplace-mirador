import {TileLayer, GeoJSON, Tooltip, Marker, useMap} from 'react-leaflet';
import L from 'leaflet';
import React, {useEffect, useState} from 'react';
import { bbox, featureCollection, bboxPolygon} from '@turf/turf';
import {icon} from "leaflet/dist/leaflet-src.esm";

export default function CanvasMap(props) {
    console.log(props.manifests);
    console.log(props.windows);
    const map = useMap();
    const [geojsonComponents, setGeojsonComponents] = useState([]);
    const manifests = props.manifests;
    const windows = props.windows;
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

    useEffect(() => {
        if (Object.values(manifests).length > 0) {
            const allManifests = Object.values(manifests).filter(m => !m.isFetching).filter(m => m?.json?.navPlace);
            let geojsonManifests = allManifests
                .filter(m => m.json.navPlace);
            let geojson = allManifests
                .map(m => m.json.navPlace);
            console.log(geojson);

            // What should the map focus on?
            let zoomGeoJson = geojson;
            // If Mirador window(s) are open, focus on their locations
            let windowIds = [];
            if (Object.values(windows).length > 0) {
                windowIds = Object.values(windows).map(w => w.manifestId);
            }
            let openManifests = [];
            if (windowIds.length > 0) {
                openManifests = geojsonManifests.filter(m => windowIds.includes(m.id));
                zoomGeoJson = openManifests
                    .filter(m => m.json.navPlace)
                    .map(m => m.json.navPlace);
            }

            if (geojson.length > 0) {
                // Draw all on map
                const openManifestIds = openManifests.map(m => m.id);
                const newGeojsonComponents = geojson.map((data, index) => {
                    const currentManifestId = geojsonManifests[index].id;
                    const highlight = openManifestIds.includes(currentManifestId);
                    const pointMarker = (highlight)? redMarker : blueMarker;
                    return (<GeoJSON
                        key={currentManifestId + ":" + highlight}
                        data={data}
                        eventHandlers={{
                            click: () => addNewWindow(geojsonManifests[index].id)
                        }}
                        pointToLayer={pointMarker}
                    >
                        <Tooltip>{getLabel(geojsonManifests[index].json)}</Tooltip>
                    </GeoJSON>)
                });
                setGeojsonComponents(newGeojsonComponents);

                // Get region of interest and zoom map
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
            }
        }
    }, [props.manifests, props.windows]);

   return (
       <>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
           {geojsonComponents}
       </>
   );
}