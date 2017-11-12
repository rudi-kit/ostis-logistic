// @flow
import {queryForCars} from "./model/Car"
import {queryForFarms} from "./model/Farm";
import {queryForFactories} from "./model/Factory";

export const MapUtils = {
    extractCars: function () {
        return queryForCars()
            .catch((err) => {
                console.error("cars", err);
            })
    },
    extractFactories: function () {
        return queryForFactories()
            .catch((err) => {
                console.error("factories", err);
            })
    },
    extractFarms: function () {
        return queryForFarms()
            .catch((err) => {
                console.error("farms", err);
            })
    }
};

