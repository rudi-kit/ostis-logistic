import "leaflet/dist/leaflet.css";
import "./resources/css/map.css"

import L from "leaflet";

L.Icon.Default.imagePath = "/static/common/leaflet/images/";

export * from "./src/map_component";