import {TileLayer, GeoJSON, Tooltip, useMap} from 'react-leaflet';
import React, {useEffect, useState} from 'react';
import { bbox, featureCollection, bboxPolygon} from '@turf/turf';

export default function CanvasMap(props) {
    console.log(props.manifests);
    console.log(props.windows);
    const map = useMap();
    const [geojsonComponents, setGeojsonComponents] = useState([]);
    const manifests = props.manifests;
    const windows = props.windows;

    useEffect(() => {
        if (Object.values(manifests).length > 0) {
            const allManifests = Object.values(manifests).filter(m => !m.isFetching).filter(m => m?.json?.navPlace);
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
            if (windowIds.length > 0) {
                let openManifests = allManifests.filter(m => windowIds.includes(m.id));
                zoomGeoJson = openManifests
                    .filter(m => m.json.navPlace)
                    .map(m => m.json.navPlace);
            }

            if (geojson.length > 0) {
                // Draw all on map
                const newGeojsonComponents = geojson.map((data, index) =>
                    <GeoJSON
                        key={data.id}
                        data={data}
                    ><Tooltip>{data.features[0].properties.label.en}</Tooltip></GeoJSON>);
                console.log(newGeojsonComponents);

                // Get region of interest and zoom map
                if (props.zoom) {
                    if (zoomGeoJson.length > 0) {
                        const features = zoomGeoJson.map(json => bboxPolygon(bbox(json)));
                        console.log(features);
                        const allBounds = bbox(featureCollection(features));
                        console.log(allBounds);
                        map.fitBounds([[allBounds[1], allBounds[0]], [allBounds[3], allBounds[2]]]);
                    } else {
                        map.fitWorld();
                    }
                }

                props.setNeedsUpdate(true);
                setGeojsonComponents(newGeojsonComponents);
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