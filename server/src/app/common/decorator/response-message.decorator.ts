import { SetMetadata } from '@nestjs/common';
// import { I18nPath } from 'src/generated/i18n.generated';

export const RESPONSE_MESSAGE_METADATA = 'responseMessage';

// export const ResponseMessage = (message: I18nPath) =>
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_METADATA, message);
