const passCreator = require('./modules/pass_creator/webpack.config');

module.exports = function(env, argv) {
    return [
        passCreator(env, argv)
    ];
};
