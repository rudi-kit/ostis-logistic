import {MapKeynodes} from "../keynodes.js";
import {doStructsRequest, mapConstructs, readLinks} from "../ConstrQueriesUtils";
import _ from "underscore"

/**
 * Поиск sc-конструкций
 * http://ostis-dev.github.io/sc-machine/net/sctp/  (#Итерирование сложных конструкций)
 */
function farmsQuery() {
    return [
        SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
            MapKeynodes.get("farm"),
            sc_type_arc_pos_const_perm,
            sc_type_node
        ], {
            "farm_instance": 2
        }),
        SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
            "farm_instance",
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
export async function queryForFarms() {
    const carInstanceAddresses = await doStructsRequest(farmsQuery(), mapConstructs(["farm_instance", "ltd"]));
    const linksAddresses = carInstanceAddresses.map(_.property("ltd"));
    const linksContent = await readLinks(linksAddresses);
    return carInstanceAddresses.map((instance) => Object.assign(instance, {
        scAddress: instance["farm_instance"],
        coordinates: linksContent[instance["ltd"]].split(", ")
    }))
        .map((options) => new Farm(options));
}

export class Farm {
    constructor(options){
        Object.assign(this, options);
    }
}
