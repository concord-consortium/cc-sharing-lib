import {InitMessageName, InitMessage} from "./init-message";
import {
  LaunchApplication,
  Publishable,
  PublishMessageName,
  PublishResponseMessageName,
  Representation} from "./publishable";
import { IFramePhone } from "./iframe-phone";

export interface SharableApp {
  application: LaunchApplication;
  getDataFunc(): Representation[];
}

export class SharingClient {
  phone: IFramePhone;
  context: InitMessage;
  app: SharableApp;

  constructor(phone:IFramePhone, app:SharableApp) {
    this.phone = phone;
    this.app = app;
    // For now assume that its ready to add listeners … (TBD)
    this.phone.addListener(
      InitMessageName,
      (args:InitMessage) =>
        this.context = args
    );
    this.phone.addListener(PublishMessageName, (args:any) => this.sendPublish());
  }

  sendPublish() {
    const representations = this.app.getDataFunc();
    const publishContent:Publishable = {
      context: this.context,
      createdAt: new Date(),
      application: this.app.application,
      representations: representations
    };
    this.phone.post(PublishResponseMessageName, publishContent);
  }
}
