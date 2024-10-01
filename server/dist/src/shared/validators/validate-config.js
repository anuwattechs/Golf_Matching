"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = validateConfig;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function validateConfig(config, envVariablesClass) {
    const validatedConfig = (0, class_transformer_1.plainToClass)(envVariablesClass, config, {
        enableImplicitConversion: true,
    });
    const errors = (0, class_validator_1.validateSync)(validatedConfig, {
        skipMissingProperties: false,
    });
    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
//# sourceMappingURL=validate-config.js.map