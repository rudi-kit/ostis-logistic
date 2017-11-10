import L from "leaflet";
const carIcons = {
    normal: [0,0],
    error: [2,0]
};
const width = 104;
const height = 114;

export const carIcon = function(id){
    if(!id) return undefined;
    const [noX, noY] = carIcons[id];
    return L.divIcon({className: `car ${id}`})
};