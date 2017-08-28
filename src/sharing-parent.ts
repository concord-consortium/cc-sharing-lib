import {InitMessageName, InitMessage} from "./init-message";
import {
  LaunchApplication,
  Publishable,
  PublishMessageName,
  PublishResponseMessageName,
  Representation} from "./publishable";

import {IFramePhone} from "./iframe-phone";
export type PublishResultsCallback = (p:Publishable) => void;

export class SharingParent {
  phone: IFramePhone;
  context: InitMessage;

  constructor(phone:IFramePhone, context: InitMessage, callback:PublishResultsCallback) {
    this.phone = phone;
    this.context = context;
    this.adjustContext();
    this.phone.addListener(PublishResponseMessageName, callback);
    this.phone.post(InitMessageName,this.context);
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
      : new Date();

    this.context.localId = "demo";  // TBD make a uuid or something.
  }


  sendPublish() {
    this.phone.post(PublishMessageName, {});
  }
}
