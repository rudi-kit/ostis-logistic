// @flow
import {queryForCars} from "./model/Car"
import {queryForFarms} from "./model/Farm";
import {queryForFactories} from "./model/Factory";

export const MapUtils = {
    extractCars: function () {
        return queryForCars()
            .catch((err) => {
                throw new Error("cars", err)
            })
    },
    extractFactories: function () {
        return queryForFactories()
            .catch((err) => {
                throw new Error("factories", err)
            })
    },
    extractFarms: function () {
        return queryForFarms()
            .catch((err) => {
                throw new Error("farms", err)
            })
    }
};

