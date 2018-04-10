import {carIcon} from "./CarIcon";

function makeMarker(coordinates) {
    return Object.assign(coordinates, coordinates.state && {icon: carIcon(coordinates.state)});
}

export const cars = [
    {coordinates: [52.19206, 25.266405],
    state: "normal"},
    {coordinates: [52.265865, 23.967364],
    state: "normal"},
    {coordinates: [52.633318, 24.544899],
    state: "error"}
].map(makeMarker);

export const cities = [
    {coordinates: [52.388023, 23.789555]},
    {coordinates: [52.193989, 24.264714]},
    {coordinates: [52.107802, 23.776593]},
    {coordinates: [51.907627, 26.786871]}
].map(makeMarker);