"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseMessage = exports.RESPONSE_MESSAGE_METADATA = void 0;
const common_1 = require("@nestjs/common");
exports.RESPONSE_MESSAGE_METADATA = 'responseMessage';
const ResponseMessage = (message) => (0, common_1.SetMetadata)(exports.RESPONSE_MESSAGE_METADATA, message);
exports.ResponseMessage = ResponseMessage;
//# sourceMappingURL=response-message.decorator.js.map