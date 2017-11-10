import React from "react"
import fluxify from "fluxify";
import PropTypes from "prop-types"
import createClass from "create-react-class"
import Loader from "react-loader"
import {Map} from "./map.jsx"
import {cars, cities} from "../data";

export const MapInterface = createClass({
    propTypes: {
        questions: PropTypes.array,
        store: PropTypes.object
    },

    componentDidMount () {
        this.initObjectsListener();
        this.initLoadedListener();
        fluxify.doAction('initObjects')
    },

    cleanModel () {
        fluxify.doAction('clean');
    },

    initObjectsListener: function () {
        this.props.store.on('change:objects', (objects) => {
            this.setState({objects: Object.values(objects)});
        });
    },

    initLoadedListener: function () {
        this.props.store.on('change:loaded', (loaded) => {
            this.setState({loaded: loaded});
        });
    },

    render: function () {
        return (

            <Map objects={[...cars, ...cities]} onMarkerClick={this.onClick}
                 onMapClick={this.onMapClick}/>
        );
    }
});
