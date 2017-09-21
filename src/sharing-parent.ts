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
import { Version } from "./version";
import { v1 as uuid  } from "uuid";
import { omit, merge, pick } from "lodash";

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
    this.setContext(params.context);
    this.initCallback = params.initCallback;
    this.phone.addListener(PublishResponseMessageName, params.callback);
    this.phone.addListener(InitResponseMessageName, this.initReceipt.bind(this));
    this.sendInit();
  }

  setContext(parentContext:Context) {
    const uniq = uuid();
    const localProps = ['id','localId'];
    const defaults = {
      protocolVersion: Version,
      requestTime: new Date().toISOString(),
      id: uniq,
      localId: uniq
    };
    this.context = merge(defaults, parentContext, pick(this.context, localProps)) as Context;
  }

  sendInit(newContext?:Context) {
    if(newContext) {
      this.setContext(newContext);
    }
    this.phone.post(InitMessageName, this.context);
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
