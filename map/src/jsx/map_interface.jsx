import React from "react"
import fluxify from "fluxify";
import PropTypes from "prop-types"
import createClass from "create-react-class"
import Loader from "react-loader"
import {Map} from "./map.jsx"

export const MapInterface = createClass({
    propTypes: {
        questions: PropTypes.array,
        store: PropTypes.object
    },

    componentDidMount () {
        this.cleanModel();
        this.initChosenListener();
        this.initObjectsListener();
        this.initLoadedListener();
    },

    cleanModel () {
        fluxify.doAction('clean');
    },

    initChosenListener: function () {
        this.props.store.on('change:chosen', (chosen) => {
            this.setState({chosen: chosen});
        });
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

    getInitialState: function () {
        return {
            objects: Object.values(this.props.store.objects),
            chosen: this.props.store.chosen,
            loaded: this.props.store.loaded
        };
    },

    onListClick: function () {
        fluxify.doAction('resetChosen');
    },

    onClick: function (object) {
        fluxify.doAction('chooseObject', object);
    },

    onMapClick: function (coordinates) {
        fluxify.doAction('importObject', coordinates);
    },

    //TODO remove hard-coded question
    onAgentParamsChange: function (params) {
        SCWeb.core.Main.doCommand(MapKeynodes.get('ui_menu_file_for_finding_persons'), [this.state.chosen.id]);
    },

    createViewer: function () {
        if (this.state.chosen)
            return <Article object={this.state.chosen} onListClick={this.onListClick}/>;
        else
            return <List objects={this.state.objects} onArticleClick={this.onClick}/>
    },

    render: function () {
        return (
            <Loader loaded={this.state.loaded}>
                <Map objects={this.state.objects} chosen={this.state.chosen} onMarkerClick={this.onClick}
                     onMapClick={this.onMapClick}/>
            </Loader>
        );
    }
});
