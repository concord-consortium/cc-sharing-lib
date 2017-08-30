import { InitMessage } from "./init-message";

export const Jpeg       = {type: "image/jpeg",               extension: "jpg"  };
export const Csv        = {type: "text/csv",                 extension: "csv"  };
export const Text       = {type: "text/plain",               extension: "txt"  };
export const Binary     = {type: "application/octet-stream", extension: "bin"  };
export const Json       = {type: "application/json",         extension: "json" };

export type Url         = string;

export type RepresentationType = {type:string, extension:string};

export interface Representation {
  type: RepresentationType;
  dataUrl: Url;
}

export interface LaunchApplication {
  launchUrl: Url;
  name: string;
}

export const PublishMessageName = "SharinatorPublish";
export const PublishResponseMessageName = "SharinatorPublishResponse";

export interface Publishable {
  context: InitMessage;
  createdAt: Date;
  application: LaunchApplication;
  representations: Representation[];
}
