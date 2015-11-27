var utils = require("loader-utils"),
    twig = require('twig').twig;

module.exports = function(content) {
    var id = this.resource, matches, tpl;

    this.cacheable();

    if (!id) {
        throw new Error('File name cannot be empty.');
    }

    matches = id.match(/([^\/]+$)/);

    if (matches === null) {
        throw new Error('File name is not valid "' + id + '"');
    }

    id = matches.length ? matches[1] : id;
    tpl = twig({ id: id, data: content }).compile({ module: 'node' });

    return 'module.exports = ' + tpl.match(/(?:twig\()(.*)(?:\))/m)[1] + ';';
}
