import defaults from "../defaults";
import * as rawLayerList from "../rawLayerList";
import makeRequest from "./makeRequest";
import layerBuilderMap from "../layerBuilderMap";

/**
 * Retrieves an array of rawLayer-objects from a given services-url by any set of attributes
 * Takes any kind of attribute, if "md-id" is provided it is looked up from the "dataset" property on the rawLayer
 * @todo rewrite filter function to recursively scan the rawLayer
 * @param {object} layerConfig - the attributes (key/value) to search for in provided services.json
 * @param {object} [param={}] - parameter object
 * @param {ol.Map} [param.map] - map the geojson is to be projected on
 * @param {ol.Style} [param.layerStyle] - optional style; if not given, default styling (modifiable by setCustomStyles) is used
 * @param {String} [url="https://geoportal-hamburg.de/lgv-config/services-internet.json"] - the URL to fetch the services from
 * @returns {Promise} the Promise resolving the Array of rawLayers to create the ol/Layer for
 */
export function getRawLayer (layerConfig, {map, layerStyle} = {}, url = defaults.layerConf) {
    return new Promise((res, rej) => {
        const layers = [];
        let rawLayers = [];

        makeRequest(url)
            .then(response => {
                rawLayers = response.filter(service => {
                    const attrCount = Object.keys(layerConfig).length;
                    let matches = 0;

                    for (const attr in layerConfig) {
                        if (service[attr] === layerConfig[attr]) {
                            matches += 1;
                        }
                    }
                    if (layerConfig.md_id) {
                        if (service.datasets && service.typ !== "WFS") {
                            if (service.datasets.some(set => set.md_id === layerConfig.md_id)) {
                                matches += 1;
                            }
                        }
                    }
                    return matches >= attrCount;
                });

                rawLayers.forEach(rawLayer => {
                    const layerBuilder = layerBuilderMap(rawLayer.typ),
                        layer = layerBuilder.createLayer(rawLayer, {map, layerStyle})

                    layers.push(layer);
                    window.mpapi.map.addLayer(layer);
                    rawLayerList.addToLayerList(rawLayer);
                });

                res(layers);
            }, rejected => {
                console.error(rejected);
                rej(null);
            });
    });
}

/**
 * todo
 * @param {*} layerConfig - todo
 * @param {*} url - todo
 * @returns {void}
 */
export default function (layerConfig, url = defaults.layerConf) {
    const rawLayer = typeof layerConfig === "object" ? layerConfig : {md_id: layerConfig};

    if (rawLayer.url && rawLayer.id) {
        rawLayerList.addToLayerList(rawLayer);
        window.mpapi.map.addLayer(rawLayer.id);
    }
    else {
        getRawLayer(rawLayer, {}, url);
    }
}