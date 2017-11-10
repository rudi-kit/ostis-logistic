import createClass from "create-react-class"
import PropTypes from "prop-types"
import L from "leaflet"
import {MapUtils} from "../utils"
import React from "react"
import _ from "underscore"
import {cities} from "../data";
import mapCss from "../../static/components/css/map.css"

export const Map = createClass({
    propTypes: {
        objects: PropTypes.array,
        chosen: PropTypes.object,
        onMarkerClick: PropTypes.func,
        onMapClick: PropTypes.func
    },

    createMap: function () {
        this.map = new L.Map('map', {zoomControl: false});
        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 17});
        this.map.addLayer(osm);
    },

    bindMapClickAction: function () {
        this.map.on('click', (event) => {
            if (event.originalEvent.ctrlKey)
                this.props.onMapClick(event.latlng)
        });
    },

    fixZoomControls: function () {
        new L.control.zoom({position: 'bottomright'}).addTo(this.map);
    },

    clearMap: function () {
        if (this.markers)
            this.map.removeLayer(this.markers);
    },

    addMarkersToMap: function () {
        let notEmptyObjects = this.props.objects;
        let markers = _.forEach(notEmptyObjects, (obj) => L.geoJson(obj.geojson));
        markers = _.map(markers, marker => L.marker(marker.coordinates, marker));
        let markersGroup = L.featureGroup(markers).addTo(this.map);
        this.map.fitBounds(markersGroup.getBounds());
    },

    setInitialView: function () {
        this.map.setView([53, 27], 1);
    },

    setCenter: function () {
        if (this.props.chosen && !MapUtils.empty(this.props.chosen.geojson))
            this.map.fitBounds(L.geoJSON(this.props.chosen.geojson).getBounds());
    },

    componentDidMount: function () {
        this.createMap();
        this.bindMapClickAction();
        this.setInitialView();
        this.fixZoomControls();
        this.addMarkersToMap();
    },

    componentDidUpdate: function () {
        this.clearMap();
        this.addMarkersToMap();
        this.setCenter();
        this.addMarkersToMap();
    },

    render: function () {
        return (
            <div id="map" ref="map" style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "100%",
                height: "100%",
                zIndex: 0
            }}/>
        );
    }
});
