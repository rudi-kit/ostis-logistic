import {MapKeynodes} from "../keynodes.js";
import {doStructsRequest, mapConstructs, readLinks} from "../ConstrQueriesUtils";
import _ from "underscore"

/**
 * Поиск sc-конструкций
 * http://ostis-dev.github.io/sc-machine/net/sctp/  (#Итерирование сложных конструкций)
 */
function factoriesQuery() {
    return [
        SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
            MapKeynodes.get("factory"),
            sc_type_arc_pos_const_perm,
            sc_type_node
        ], {
            "factory_instance": 2
        }),
        SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
            "factory_instance",
            sc_type_arc_common | sc_type_const,
            sc_type_link,
            sc_type_arc_pos_const_perm,
            MapKeynodes.get("nrel_ltd")
        ], {
            "ltd": 2
        })
    ];
}

// () => ScContrrResult<{freight_transport: sc_addr, ltd: sc_addr, coordinates: [number, number}>
export async function queryForFactories() {
    const carInstanceAddresses = await doStructsRequest(factoriesQuery(), mapConstructs(["factory_instance", "ltd"]));
    const linksAddresses = carInstanceAddresses.map(_.property("ltd"));
    const linksContent = await readLinks(linksAddresses);
    return carInstanceAddresses.map((instance) => Object.assign(instance, {
        scAddress: instance["factory_instance"],
        coordinates: linksContent[instance["ltd"]].split(", ")
    }))
        .map((options) => new Factory(options));
}

export class Factory {
    constructor(options){
        Object.assign(this, options);
    }
}
