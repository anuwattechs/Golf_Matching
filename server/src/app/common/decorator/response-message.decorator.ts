import { SetMetadata } from '@nestjs/common';
import { I18nPath } from 'src/generated/i18n.generated';

export const RESPONSE_MESSAGE_METADATA = 'responseMessage';

export const ResponseMessage = (message: I18nPath) =>
  SetMetadata(RESPONSE_MESSAGE_METADATA, message);
