"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = void 0;
const crypto_1 = require("crypto");
const compare = (userInput, secret) => {
    const userInputLength = Buffer.byteLength(userInput);
    const secretLength = Buffer.byteLength(secret);
    const userInputBuffer = Buffer.alloc(userInputLength, 0, 'utf8');
    userInputBuffer.write(userInput);
    const secretBuffer = Buffer.alloc(secretLength, 0, 'utf8');
    secretBuffer.write(secret);
    return !!((0, crypto_1.timingSafeEqual)(userInputBuffer, secretBuffer) &&
        userInputLength === secretLength);
};
exports.compare = compare;
//# sourceMappingURL=compare.function.js.map