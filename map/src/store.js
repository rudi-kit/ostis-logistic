import fluxify from "fluxify";
import {MapUtils} from "./utils"
import {cars, cities} from "./data";

export const MapStore = {
    get: function () {
        this.store = this.store || this.create();
        return this.store;
    },

    create: function () {
        return fluxify.createStore({
            id: "MapStore",
            initialState: {
                objects: {},
                chosen: null,
                contour: null,
                loaded: true
            },
            actionCallbacks: {
                initObjects: function (updater, coordinates) {
                    MapUtils.extractCars().then(cars => (console.log(cars),cars))
                        .then((cars) => updater.set({objects: cars})).catch(console.error)
                }
            }
        });
    }
};