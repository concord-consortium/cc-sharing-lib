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

let iframeCounter = 0;
const generateFrameId = () => ++iframeCounter;

export interface ChildConnectionParams {
  context:Context;
  iframe: HTMLIFrameElement;
  publishResponseCallback: (p:PublishResponse) => void;
  initCallback?(msg: InitResponseMessage): void;
}

export class ChildConnection {
  connection: SharingParent;
  iframe: HTMLIFrameElement;
  phone: IFramePhoneDown;
  context: Context;
  id: number;

  constructor(options: ChildConnectionParams) {
    this.iframe = options.iframe;
    this.id = generateFrameId();
    this.context = _.clone(options.context);
    this.context.id = this.id;
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
}
