import * as wms from "./layer/wms";
import * as geojson from "./layer/geojson";

/**
 * lookup for layer constructors
 * @ignore
 */
const layerBuilderMap = {
    wms,
    geojson
};

/**
 * retrieves the layer constructor for the provided typename from the layerBuilderMap
 * @param {String} type - the typename ("wms", "geojson", ...)
 * @returns {Function} the layerBuilder Method
 */
export default function (type) {
    return layerBuilderMap[type.toLowerCase()];
}