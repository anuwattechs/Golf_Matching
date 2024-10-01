"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const interceptors_1 = require("./app/common/interceptors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.setGlobalPrefix(process.env.API_PREFIX || '/api');
    app.useGlobalInterceptors(new interceptors_1.ResponseInterceptor(new core_1.Reflector()));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map