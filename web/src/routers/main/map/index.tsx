import React, { useState } from "react";

import { Button } from "antd";

import {
  Map,
  APILoader,
  ScaleControl,
  ToolBarControl,
  ControlBarControl,
  Marker,
  InfoWindow,
} from "@uiw/react-amap";

function MapView() {
  const [isShowInfoWindow, setIsShowInfoWindow] = useState(false);
  const [infoWindowPosition, setInfoWindowPosition] = useState(
    new AMap.LngLat(121.437, 31.026)
  );
  return (
    <Map center={[121.437, 31.026]} zoom={15}>
      <>
        <ScaleControl offset={[16, 30]} position="LB" />
        <ToolBarControl offset={[16, 10]} position="RB" />
        <ControlBarControl offset={[16, 180]} position="RB" />
        <Marker
          title="北京市"
          position={new AMap.LngLat(116.415285, 39.905589)}
          onClick={(evn) => {
            if (!isShowInfoWindow) {
              setInfoWindowPosition(new AMap.LngLat(116.415285, 39.905589));
              setIsShowInfoWindow(true);
            } else {
              setInfoWindowPosition(new AMap.LngLat(116.415285, 39.905589));
            }
          }}
        />
        {infoWindowPosition && (
          <InfoWindow
            visiable={isShowInfoWindow}
            position={infoWindowPosition}
            offset={new window.AMap.Pixel(0, -10)}
            content={"<div>高德软件</div>"}
            onClose={(evn) => {
              console.log("evn2", evn);
            }}
          />
        )}
      </>
    </Map>
  );
}

export default function MapPage() {
  const [isShowMarker, setIsShowMarker] = useState(true);
  return (
    <>
      <Button onClick={() => setIsShowMarker(!isShowMarker)}>
        显示/隐藏Marker
      </Button>
      <APILoader akay={process.env.REACT_APP_AMAPKEY}>
        <MapView />
      </APILoader>
    </>
  );
}
