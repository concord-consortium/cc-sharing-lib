export type Identifier       = string | number;
export type ProtocolVersion  = string;
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

export interface InitMessage {
  protocolVersion: ProtocolVersion;
  requestTime: Date;
  userId: User;
  groupId: Group;
  offeringId: Offering;
  localId: Identifier;
}
