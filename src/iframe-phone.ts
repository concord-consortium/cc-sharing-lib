export type MessageContent = any;
export type MessageType = string;
export type Listener = (args:any)=>void;


export interface IFramePhoneUp {
  post(type:MessageType, content:MessageContent): void;
  addListener(messageName:string, listener:Listener): void;
  disconnect(): void;
  connected: boolean;
  initialize():void;
  getListenerNames(): Listener[];
  removeAllListeners(): void;
}
export interface IFramePhoneDown {
  post(type:MessageType, content:MessageContent): void;
  addListener(messageName:string, listener:Listener): void;
  removeListener(messageName:string): void;
  disconnect(): void;
  connected: boolean;
  getTargetWindow(): Window;
  targetOrigin: string;
}

export const IFramePhoneFactory:IFramePhoneLib = require("iframe-phone");

export interface IFramePhoneLib {
  // SEE: https://github.com/concord-consortium/iframe-phone/blob/master/lib/parent-endpoint.js
  ParentEndpoint(iframe:HTMLIFrameElement, afterConnectedCallback?: (args:any) => void):  IFramePhoneDown;
  // SEE: https://github.com/concord-consortium/iframe-phone/blob/master/lib/iframe-endpoint.js
  getIFrameEndpoint: () => IFramePhoneUp;
}
