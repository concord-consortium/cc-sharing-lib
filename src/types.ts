export const Jpeg       = {type: "image/jpeg",               extension: "jpg"  };
export const Csv        = {type: "text/csv",                 extension: "csv"  };
export const Text       = {type: "text/plain",               extension: "txt"  };
export const Binary     = {type: "application/octet-stream", extension: "bin"  };
export const Json       = {type: "application/json",         extension: "json" };

export const InitMessageName            = "SharinatorInit";
export const InitResponseMessageName    = "SharinitorInitResponse";

export const PublishMessageName         = "SharinatorPublish";
export const PublishResponseMessageName = "SharinatorPublishResponse";

export const PublishMessage = { send: true };

export type Url                = string;
export type Identifier         = string | number;
export type ProtocolVersion    = string;
export type ISODateString      = string;
export type RepresentationType = {type:string, extension:string};

export interface PublicationListener {
  newPublication?: (publication: PublishResponse) => void;
  newInitResponse?: (initResponse: InitResponseMessage) => void;
}

export interface SharableApp {
  application: LaunchApplication;
  getDataFunc(context:Context): Promise<Representation[]>;
}

export interface User {
  displayName: string;
  id: Identifier;
}

export interface Group {
  displayName: string;
  id: Identifier;
}

export interface Offering {
  displayName: string;
  id: Identifier;
}

export interface Clazz {
  displayName: string;
  id: Identifier;
}

export interface InitResponseMessage {
  id: Identifier;
  localId: Identifier;
  Application: LaunchApplication;
}


export interface Context {
  protocolVersion: ProtocolVersion;
  id: Identifier;
  requestTime: ISODateString;
  user: User;
  group: Group;
  offering: Offering;
  clazz: Clazz;
  localId: Identifier;
}

export interface Representation {
  type: RepresentationType;
  dataUrl: Url;
  name?: string;
}

export interface LaunchApplication {
  launchUrl: Url;
  name: string;
}

export interface PublishResponse {
  context: Context;
  createdAt: ISODateString;
  application: LaunchApplication;
  representations: Representation[];
  children: PublishResponse[];
}
