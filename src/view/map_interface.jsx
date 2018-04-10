import React from "react"
import fluxify from "fluxify";
import PropTypes from "prop-types"
import {Map} from "./map.jsx"

export class MapInterface extends React.Component {
    constructor() {
        super();
        this.state = {
            objects: []
        }

    }

    componentDidMount() {
        this.initObjectsListener();
        this.initLoadedListener();
        fluxify.doAction('initObjects')
    }

    cleanModel() {
        fluxify.doAction('clean');
    }

    initObjectsListener() {
        this.props.store.on('change:objects', (objects) => {
            this.setState({objects: Object.values(objects)});
        });
    }

    initLoadedListener() {
        this.props.store.on('change:loaded', (loaded) => {
            this.setState({loaded: loaded});
        });
    }

    render() {
        return (
            <Map objects={this.state.objects} onMarkerClick={this.onClick}
                 onMapClick={this.onMapClick}/>
        );
    }

}
