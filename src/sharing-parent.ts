import {
  InitMessageName,
  Context,
  InitResponseMessageName,
  InitResponseMessage,
  LaunchApplication,
  PublishResponse,
  PublishMessageName,
  PublishMessage,
  PublishResponseMessageName,
  Representation
} from "./types";

import { IFramePhoneDown } from "./iframe-phone";

import { v1 as uuid} from "uuid";


export type PublishResultsCallback = (p:PublishResponse) => void;

export interface SharingParentParams {
  phone:IFramePhoneDown;
  context: Context;
  callback:PublishResultsCallback;
  initCallback?(msg: InitResponseMessage): void;
}

export class SharingParent {
  phone: IFramePhoneDown;
  context: Context;
  initCallback?(msg: InitResponseMessage): void;

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
    return "1.0.6";
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
    if (this.initCallback) {
      this.initCallback(ack);
    }
  }

}
