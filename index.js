var utils = require("loader-utils"),
    twig = require('twig').twig;

module.exports = function(content) {
    var id = this.resource, matches, template, compiled;

    this.cacheable();

    if (!id) {
        throw new Error('File name cannot be empty.');
    }

    matches = id.match(/([^\/]+$)/);

    if (matches === null) {
        throw new Error('File name is not valid "' + id + '"');
    }

    id = matches.length ? matches[1] : id;

    // Checking for cached template
    template = twig({ ref: id });
    if (template === null) {
        template = twig({ id: id, data: content });
    }

    compiled = template.compile({ module: 'node' });
    return 'module.exports = ' + compiled.match(/(?:twig\()(.*)(?:\))/m)[1] + ';';
}