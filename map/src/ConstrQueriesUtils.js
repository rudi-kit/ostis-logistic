import _ from "underscore"

export function wrapJQueryDerefered(derefered) {
    return new Promise((res, rej) => derefered.then(res, rej));
}

export async function doStructsRequest(query, mapper) {
    return wrapJQueryDerefered(window.sctpClient.iterate_constr.apply(window.sctpClient, query))
        .then(mapper);
}


// (scAddr|[...scAddr]) => Promise<{scAddr: linkContent}>
export async function readLinks(addrs) {
    if (!Array.isArray(addrs)) addrs = [addrs];
    const linksPromises = addrs.map((addr) => {
        return wrapJQueryDerefered(window.sctpClient.get_link_content(addr));
    });
    return Promise.all(linksPromises).then((content) => _.object(addrs, content));
}

// (ScConstrResults, [...string]) => [{...}]
export const mapConstructs = (requiredFields) => (constructs) => {
    //[[...scAddress]]
    const values = constructs.results.map((el, idx) => requiredFields.map((field) => constructs.get(idx, field)));
    return values.map((scAddrs) => _.object(requiredFields, scAddrs))
}
