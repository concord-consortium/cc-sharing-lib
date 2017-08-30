export type MessageContent = any;
export type MessageType = string | object;
export type listener = any;

export interface IFramePhone {
  connected: boolean;
  initialize():void;
  getListenerNames(): listener[];
  addListener(messageName:string, listener:(args:any)=>void): void;
  removeAllListeners(): void;
  disconnect(): void;
  post(type:MessageType, content:MessageContent): void;
}

export interface IFramePhoneLib {
  ParentEndpoint(iframe:HTMLIFrameElement, callback: (args:any) => void):  IFramePhone;
}
