import {MapKeynodes} from "../keynodes.js";
import {doStructsRequest, mapConstructs, readLinks} from "../ConstrQueriesUtils";
import _ from "underscore";
import * as L from "leaflet";

function carsQuery() {
    return [
        SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
            MapKeynodes.get('freight_transport'),
            sc_type_arc_common | sc_type_const,
            sc_type_node,
            sc_type_arc_pos_const_perm,
            MapKeynodes.get('nrel_inclusion')
        ], {
            "freight_transport_classes": 2
        }),
        SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
            "freight_transport_classes",
            sc_type_arc_pos_const_perm,
            sc_type_node
        ], {
            "freight_transport_instance": 2
        }),
        SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
            "freight_transport_instance",
            sc_type_arc_common | sc_type_const,
            sc_type_link,
            sc_type_arc_pos_const_perm,
            MapKeynodes.get("nrel_ltd")
        ], {
            "ltd": 2
        })
    ];
}

function carsStateQuery() {
    return carsQuery().concat([
        SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_F_A_F, [
            MapKeynodes.get("emergency_three"),
            sc_type_arc_pos_const_perm,
            "freight_transport_instance",
            sc_type_arc_pos_const_perm,
            MapKeynodes.get("rrel_participant")
        ]),
    ]);
}

async function emptyObjectOnReject(func, args) {
    try{
        return await func.apply(null, args);
    }catch (err){
        console.error(err);
        return {};
    }
}

// () => ScContrrResult<{freight_transport: sc_addr, ltd: sc_addr, coordinates: [number, number}>
export async function queryForCars() {
    const carInstanceAddresses = await doStructsRequest(carsQuery(), mapConstructs(["freight_transport_instance", "ltd"]));
    let carStates = await emptyObjectOnReject(doStructsRequest,[carsStateQuery(), mapConstructs(["freight_transport_instance"])]);
    carStates = _.map(carStates, _.property("freight_transport_instance"))
    carStates = _.object(carStates, carStates);
    const linksAddresses = carInstanceAddresses.map(_.property("ltd"));
    const linksContent = await readLinks(linksAddresses);
    return carInstanceAddresses.map((instance) => Object.assign(instance, {
        scAddress: instance["freight_transport_instance"],
        coordinates: linksContent[instance["ltd"]].split(", "),
        state: carStates[instance["freight_transport_instance"]] ? "error" : "normal"
    }))
        .map((options) => new Car(options));
}

const carIcons = {
    error: "/static/components/images/car-error.png",
    normal: "/static/components/images/car-normal.png"
}

export class Car {
    constructor(options) {
        Object.assign(this, options);
        this.icon = L.icon({
            iconUrl: carIcons[this.state],
            iconSize: [128, 74]
        });
    }
}
