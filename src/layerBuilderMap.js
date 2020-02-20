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

export default function (type) {
    return layerBuilderMap[type.toLowerCase()];
}