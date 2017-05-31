var Twig = require('twig');

module.exports = function(content) {
    var id = this.resource, matches, template, compiled, query, isCacheEnabled = false;

    this.cacheable();

    if (!id) {
        throw new Error('File name cannot be empty.');
    }

    matches = id.match(/([^\/]+$)/);

    if (matches === null) {
        throw new Error('File name is not valid "' + id + '"');
    }

    id = matches.length ? matches[1] : id;

    if (this.query) {
        // in webpack v2, this.query comes in the following format: { enablecache: false }
        if (typeof(this.query.enablecache) === 'boolean') {
            isCacheEnabled = this.query.enablecache;
        } else if (typeof(this.query) === 'string') {
            // in webpack v1, this.query comes in the following format: ?{"enablecache":false}
            query = JSON.parse(this.query.slice(1));
            isCacheEnabled = query.enablecache;
        }
    }

    // Checking for cached template
    template = Twig.twig({ ref: id, rethrow: true });
    if (template === null) {
        template = Twig.twig({ id: id, data: content, rethrow: true });
    }

    // Removing the template from cache
    if (!isCacheEnabled) {
        Twig.extend(function(Twig) {
            delete Twig.Templates.registry[id];
        });
    }

    compiled = template.compile({ module: 'node' });
    return 'module.exports = ' + compiled.match(/(?:twig\()(.*)(?:\))/m)[1] + ';';
};
