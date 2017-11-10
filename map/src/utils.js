// @flow
import {MapStore} from "./store.js"
import {MapKeynodes} from "./keynodes.js"

export const MapUtils = {
    // () => Promise<[{coordinate:[number,number]}]>
    extractCars: function () {
        const mapPesponce = (res) => {
            return res.results.map((el, idx) => {
                return {
                    scAddr: res.get(idx, "freight_transport_instance"),
                    ltdLink: res.get(idx, "ltd")
                }
            })
        };
        const readLinks = async (res) => {
            const promises = res.map((res) => new Promise((resolve, reject) => {
                window.sctpClient.get_link_content(res.ltdLink).done(resolve).fail(reject)
            }));
            const links = await Promise.all(promises);
            return links.map((link, idx) => Object.assign(res[idx], {coordinates: link.split(", ")}))
        };
        return new Promise((resolve, reject) => {
            window.sctpClient.iterate_constr(
                SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                    [
                        MapKeynodes.get('freight_transport'),
                        sc_type_arc_common | sc_type_const,
                        sc_type_node,
                        sc_type_arc_pos_const_perm,
                        MapKeynodes.get('nrel_inclusion')
                    ], {"freight_transport_classes": 2}),
                SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_A,
                    [
                        "freight_transport_classes",
                        sc_type_arc_pos_const_perm,
                        sc_type_node
                    ], {"freight_transport_instance": 2}),
                SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                    [
                        "freight_transport_instance",
                        sc_type_arc_common | sc_type_const,
                        sc_type_link,
                        sc_type_arc_pos_const_perm,
                        MapKeynodes.get("nrel_ltd")
                    ], {"ltd": 2})
            ).done(resolve)
                .fail(reject);
        })
            .then(mapPesponce)
            .then(readLinks);
    }
};