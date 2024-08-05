"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensure = void 0;
const ensure = (option, defaultValue) => {
    if (option === undefined) {
        return () => defaultValue;
    }
    if (typeof option !== 'function') {
        return () => option;
    }
    return option;
};
exports.ensure = ensure;
//# sourceMappingURL=ensure.function.js.map