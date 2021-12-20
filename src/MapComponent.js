import React from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Point from "@arcgis/core/geometry/Point";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";

const MapComponent = (props) => {
  const mapRef = React.useRef();

  const centralPoint = new Point({
    x: props.centralPoint.x,
    y: props.centralPoint.y,
    spatialReference: 3857,
  });
  //default map center on revolution hall, TGG HQ.

  // console.log(props.rings);

  React.useEffect(() => {
    const map = new Map({
      basemap: "arcgis-topographic",
    });
    const mapView = new MapView({
      container: mapRef.current,
      map: map,
      center: centralPoint,
      zoom: 15,
    });
    //the dynamic map from the arcgis module
    const graphicsLayer = new GraphicsLayer();

    map.add(graphicsLayer);

    // MapPoint set to orange

    const simpleMarkerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40], // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 1,
      },
    };

    const pointGraphic = new Graphic({
      geometry: centralPoint,
      symbol: simpleMarkerSymbol,
    });
    graphicsLayer.add(pointGraphic);

    const polygon = {
      type: "polygon",
      rings: props.rings,
      spatialReference: 3857,
    };

    const simpleFillSymbol = {
      type: "simple-line",
      color: [227, 139, 79], // Orange, opacity 80%
      outline: {
        color: [255, 255, 255],
      },
      width: 5,
    };

    const polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: simpleFillSymbol,
    });
    graphicsLayer.add(polygonGraphic);

    // console.log(mapView);
  }, [props.centralPoint, props.rings]);

  return (
    <div>
      <div className="webmap" ref={mapRef}></div>
    </div>
  );
};

export default MapComponent;
