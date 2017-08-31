
export type Identifier       = string | number;
export type ProtocolVersion  = string;
export type ISODateString = string;
export const InitMessageName = "SharinatorInit";


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
