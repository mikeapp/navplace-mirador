export default function AutoFocusControl(props) {
    const POSITION_CLASSES = {
        bottomleft: 'leaflet-bottom leaflet-left',
        bottomright: 'leaflet-bottom leaflet-right',
        topleft: 'leaflet-top leaflet-left',
        topright: 'leaflet-top leaflet-right',
    }

    const positionClass = POSITION_CLASSES.topright;

    let handleClick = (event) => {
        console.log(event.target.checked);
        props.setZoom(!props.zoom);
        event.preventDefault();
    }

    const style = {
        backgroundColor: '#FFFFFF',
        padding: "0.5em"
    }

    return (
        <div className={positionClass}>
            <div className="leaflet-control leaflet-bar" style={style}>
                <input type="checkbox" onChange={handleClick} checked={props.zoom} />Zoom to Items
            </div>
        </div>
    );
}