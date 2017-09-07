import {
  InitMessageName,
  Context,
  InitResponseMessageName,
  InitResponseMessage
} from "./init-message";

import {
  LaunchApplication,
  PublishResponse,
  PublishMessageName,
  PublishMessage,
  PublishResponseMessageName,
  Representation} from "./publishable";

import { IFramePhoneDown } from "./iframe-phone";

import { v1 as uuid} from "uuid";


export type PublishResultsCallback = (p:PublishResponse) => void;
export type InitResponseCallback = (initReply: InitResponseMessage) => void;

export interface SharingParentParams {
  phone:IFramePhoneDown;
  context: Context;
  callback:PublishResultsCallback;
  initCallback?: InitResponseCallback;
}

export class SharingParent {
  phone: IFramePhoneDown;
  context: Context;
  initCallback?: InitResponseCallback;

constructor(params:SharingParentParams) {
    this.phone = params.phone;
    this.context = params.context;
    this.initCallback = params.initCallback;
    this.adjustContext();
    this.phone.addListener(PublishResponseMessageName, params.callback);
    this.phone.addListener(InitResponseMessageName, this.initReceipt.bind(this));
    this.phone.post(InitMessageName, this.context);
  }

  version() {
    return "1.0.0";  // TBD
  }

  adjustContext() {
    this.context.protocolVersion = this.context.protocolVersion
      ? this.context.protocolVersion
      : this.version();
    this.context.requestTime = this.context.requestTime
      ? this.context.requestTime
      : new Date().toISOString();
    this.context.localId = this.context.localId
      ? this.context.localId
      : uuid();
  }

  sendPublish() {
    this.phone.post(PublishMessageName, PublishMessage);
  }

  initReceipt(ack:InitResponseMessage) {
    this.log("init received:");
    this.log(ack);
    if (this.initCallback) {
      this.initCallback(ack);
    }
  }

  log(message:string|object) {
    if(console && console.log) {
      console.log(message);
    }
  }
}
