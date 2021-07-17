import {MapContainer, TileLayer, GeoJSON, Tooltip, useMap} from 'react-leaflet';
import React, {useEffect, useState} from 'react';
import { bbox, featureCollection, bboxPolygon} from '@turf/turf';

export default function CanvasMap(props) {
    console.log(props.manifests);
    console.log(props.windows);
    const map = useMap();
    const [geojsonComponents, setGeojsonComponents] = useState([]);
    const manifests = props.manifests;

    useEffect(() => {
        if (Object.values(manifests).length > 0) {
            let geojson = Object.values(manifests)
                .filter(m => !m.isFetching)
                .filter(m => m.json.navPlace)
                .map(m => m.json.navPlace);
            console.log(geojson);
            if (geojson.length > 0) {
                const newGeojsonComponents = geojson.map((data, index) =>
                    <GeoJSON
                        key={data.id}
                        data={data}
                    ><Tooltip>Location {data.features[0].properties.label.en}</Tooltip></GeoJSON>);
                console.log(newGeojsonComponents);
                const features = geojson.map(json => bboxPolygon(bbox(json)));
                console.log(features);
                const allBounds = bbox(featureCollection(features));
                console.log(allBounds);
                map.fitBounds([[allBounds[1], allBounds[0]], [allBounds[3], allBounds[2]]]);
                props.setNeedsUpdate(true);
                setGeojsonComponents(newGeojsonComponents);
            }
        }
    }, [props.manifests]);


   return (
       <>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
           {geojsonComponents}
       </>
   );
}