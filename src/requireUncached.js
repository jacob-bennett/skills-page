module.exports = function (module) {
    module = `../${module}`;
    delete require.cache[require.resolve(module)];
    return require(module)
};
