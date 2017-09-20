export const Jpeg             = {type: "image/jpeg",                       extension: "jpg"      };
export const Png              = {type: "image/png",                        extension: "png"      };
export const Gif              = {type: "image/gif",                        extension: "gif"      };
export const Csv              = {type: "text/csv",                         extension: "csv"      };
export const Text             = {type: "text/plain",                       extension: "txt"      };
export const Binary           = {type: "application/octet-stream",         extension: "bin"      };
export const Json             = {type: "application/json",                 extension: "json"     };
export const CODAP            = {type: "application/x-codap",              extension: "codap"    };
export const CODAPDataContext = {type: "application/x-codap-data-context", extension: "codap-dc" };

export const MessagePrefix              = "Sharinator";
export const InitMessageName            = `${MessagePrefix}Init`;
export const InitResponseMessageName    = `${MessagePrefix}InitResponse`;

export const PublishMessageName         = `${MessagePrefix}Publish`;
export const PublishResponseMessageName = `${MessagePrefix}PublishResponse`;
export const PublishMessage             = { send: true };

export const PublishFailMessageName     = `${MessagePrefix}PublishFail`;


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
  initCallback?(context:Context): void;
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

export interface PublishFailMessage {
  reason: string;
}
