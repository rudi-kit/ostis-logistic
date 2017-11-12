export const MapKeynodes = {};

MapKeynodes.IDENTIFIERS = [
    'freight_transport',
    'nrel_inclusion',
    'nrel_ltd',
    'factory',
    'farm'
];

MapKeynodes.init = function () {
    var deferred = $.Deferred();
    var self = this;
    SCWeb.core.Server.resolveScAddr(MapKeynodes.IDENTIFIERS, function (keynodes) {
        self.keynodes = keynodes;
        deferred.resolve();
    });
    return deferred;
};


MapKeynodes.get = function (identifier) {
    return this.keynodes[identifier];
};