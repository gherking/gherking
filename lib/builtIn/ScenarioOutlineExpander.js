'use strict';

const DefaultConfig = require('../DefaultConfig');

/**
 * @typedef {Object} ScenarioOutlineExpanderConfiguration
 * @property {string} ignoreTag
 */
const DEFAULT_CONFIG = {
    ignoreTag: '@notExpand',
};


class ScenarioOutlineExpander extends DefaultConfig {
    /**
     * @constructor
     * @param {ScenarioOutlineExpanderConfig|Object} config
     */
    constructor(config) {
        super();
        this.config = Object.assign({}, DEFAULT_CONFIG, config || {});
    }

    onScenarioOutline(outline){ 
        
        if (!outline.tags || !outline.tags.find(tag => this.config.ignoreTag === tag.name )) {
            return outline.toScenario();
        }
        if(outline.tags.length){
            outline.tags = outline.tags.filter(tag => tag.name !== this.config.ignoreTag )
        }

        
       
    }



}
module.exports = ScenarioOutlineExpander;