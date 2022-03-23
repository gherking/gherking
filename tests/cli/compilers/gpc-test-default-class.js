class PreCompiler {
    onFeature(feature) {
        feature.name += "DEFAULT"
    }
}

module.exports = {
    default: PreCompiler
}