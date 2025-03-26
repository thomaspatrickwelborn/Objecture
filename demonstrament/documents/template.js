export default function anonymous(data) {
    var include = function(path, includeData) {
        var d = utils.shallowCopy(utils.createNullProtoObjWherePossible(), data);
        if (includeData) {
            d = utils.shallowCopy(d, includeData);
        }
        return includeFile(path, opts)(d);
    };
    return fn.apply(opts.context,
        [data || utils.createNullProtoObjWherePossible(), escapeFn, include, rethrow]);
}