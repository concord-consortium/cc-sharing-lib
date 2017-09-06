import {
  SharingParent,
  IFramePhoneDown,
  IFramePhoneFactory,
  Context,
  PublishResponse,
  InitResponseCallback
} from "./index";

import * as _ from "lodash";

let iframeCounter = 0;
const generateFrameId = () => ++iframeCounter;

export class ChildConnection {
  connection?: SharingParent;
  iframe: HTMLIFrameElement;
  phone: IFramePhoneDown;
  context: Context;
  id: number;

  constructor(
    parentContext:Context,
    iframe: HTMLIFrameElement,
    publishResponseCallback: (p:PublishResponse) => void,
    initResponseCallback: InitResponseCallback
  ) {
    this.iframe = iframe;
    this.id = generateFrameId();
    this.context = _.clone(parentContext);
    this.context.id = this.id;
    this.phone = IFramePhoneFactory.ParentEndpoint(this.iframe, ()=> console.log("connecting iframe"));
    this.connection = new SharingParent(this.phone, this.context, publishResponseCallback, initResponseCallback);
  }
  disconnect() {
    this.phone.disconnect();
  }
  sendPublish() {
    if(this.connection) {
      this.connection.sendPublish();
    }
  }
}
