export class TagDto {
  _id: string;
  tagName: string;
  etag: string;
  key: string;
}

export class CreateTagDto {
  tagName: string;
  etag: string;
  key: string;
}
