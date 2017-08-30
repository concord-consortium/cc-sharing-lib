import {
  InitMessageName,
  InitMessage,
  InitResponseMessageName,
  InitResponseMessage
} from "./init-message";

import {
  LaunchApplication,
  Publishable,
  PublishMessageName,
  PublishResponseMessageName,
  Representation} from "./publishable";

import { v1 as uuid} from "uuid";

import {IFramePhone} from "./iframe-phone";
export type PublishResultsCallback = (p:Publishable) => void;

export class SharingParent {
  phone: IFramePhone;
  context: Context;

  constructor(phone:IFramePhone, context: Context, callback:PublishResultsCallback) {
    this.phone = phone;
    this.context = context;
    this.adjustContext();
    this.phone.addListener(PublishResponseMessageName, callback);
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

    this.context.localId = "demo";  // TBD make a uuid or something.
      : new Date();
    this.context.localId = this.context.localId
      ? this.context.localId
      : uuid();
  }

  sendPublish() {
    this.phone.post(PublishMessageName, {});
  }

  initReceipt(ack:InitResponseMessage) {
    this.log("init received:");
    this.log(ack);
  }

  log(message:string|object) {
    if(console && console.log) {
      console.log(message);
    }
  }
}
