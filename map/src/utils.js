// @flow
import {queryForCars} from "./model/Car"

export const MapUtils = {
    extractCars: function () {
        return queryForCars()
    }
};