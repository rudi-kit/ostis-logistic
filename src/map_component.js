import {MapStore} from "./store.js"
import {MapKeynodes} from "./keynodes"
import {MapInterface} from "./view/map_interface.jsx"
import fluxify from "fluxify";
import ReactDOM from "react-dom"
import React from "react"

const MapComponent = {
    ext_lang: 'openstreetmap_view',
    formats: ['format_openstreetmap_view'],
    struct_support: true,
    factory: function (sandbox) {
        let viewer = new MapViewer(sandbox);
        viewer.init();
        return viewer;
    }
};

const MapViewer = function (sandbox) {
    this.sandbox = sandbox;
};

MapViewer.prototype.init = function () {
    let self = this;
    MapKeynodes.init().done(function () {
        self.initCallback();
        self.sandbox.updateContent();
        self.createReactComponent();
    });
};

MapViewer.prototype.initCallback = function () {
    this.sandbox.eventStructUpdate = $.proxy(this.eventStructUpdate, this);
};

MapViewer.prototype.createReactComponent = function () {
    let store = this.createStore();
    let mapInterface = React.createElement(MapInterface, {store: store, questions: this.getQuestions()});
    ReactDOM.render(mapInterface, document.getElementById(this.sandbox.container));
};

MapViewer.prototype.createStore = function () {
    return MapStore.get();
};

MapViewer.prototype.eventStructUpdate = function (added, contour, arc) {
    // fluxify.doAction('changeContour', contour);
    // if (added) MapUtils.extractor(arc, contour).extract();
};

MapViewer.prototype.getQuestions = function () {
    return [
        "С какими персонами связано здание?",
    ]
};

SCWeb.core.ComponentManager.appendComponentInitialize(MapComponent);
