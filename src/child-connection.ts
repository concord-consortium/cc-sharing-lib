import { SharingParent } from "./sharing-parent";
import { IFramePhoneDown, IFramePhoneFactory } from "./iframe-phone";

import {
  InitMessageName,
  InitResponseMessage,
  InitResponseMessageName,
  Context,
  PublishResponse
} from "./types";

import * as _ from "lodash";


export interface ChildConnectionParams {
  context:Context;
  iframe: HTMLIFrameElement;
  id: string;
  publishResponseCallback: (p:PublishResponse) => void;
  initCallback?(msg: InitResponseMessage): void;
}

export class ChildConnection {
  connection: SharingParent;
  iframe: HTMLIFrameElement;
  phone: IFramePhoneDown;
  context: Context;
  id: string;

  constructor(options: ChildConnectionParams) {
    this.iframe = options.iframe;
    this.id = options.id;
    this.context = _.clone(options.context);
    this.phone = IFramePhoneFactory.ParentEndpoint(this.iframe);
    this.connection = new SharingParent({
      callback: options.publishResponseCallback,
      phone: this.phone,
      context: this.context,
      initCallback: options.initCallback
    });

  }
  disconnect() {
    this.phone.disconnect();
  }
  sendPublish() {
    this.connection.sendPublish();
  }
  sendInit(newContext?:Context) {
    this.connection.sendInit(newContext);
  }
}
