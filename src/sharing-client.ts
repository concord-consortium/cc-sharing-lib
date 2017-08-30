import {
  InitMessageName,
  InitResponseMessage,
  InitResponseMessageName,
  InitMessage} from "./init-message";
import {
  LaunchApplication,
  Publishable,
  PublishMessageName,
  PublishResponseMessageName,
  Representation} from "./publishable";
import { IFramePhone } from "./iframe-phone";

export interface SharableApp {
  application: LaunchApplication;
  getDataFunc(context:Context): Promise<Representation[]>;
}

export class SharingClient {
  phone: IFramePhone;
  context: Context;
  app: SharableApp;

  constructor(phone:IFramePhone, app:SharableApp) {
    this.phone = phone;
    this.app = app;
    // For now assume that its ready to add listeners … (TBD)
    this.phone.addListener(
      InitMessageName,
      (args:InitMessage) => {
        this.context = args;
        this.sendInitResponse();
      }
    );
    this.phone.addListener(PublishMessageName, (args:any) => this.sendPublish());
  }

  sendInitResponse() {
    const initResponse:InitResponseMessage = {
      localId: this.context.localId,
      Application: this.app.application
    };
    this.phone.post(InitResponseMessageName, initResponse);
  }

  sendPublish() {
    const promise = this.app.getDataFunc(this.context);
    promise.then((representations) => {
      const publishContent:Publishable = {
        context: this.context,
        createdAt: new Date().toISOString(),
        application: this.app.application,
        representations: representations,
        children: []
      };
      this.phone.post(PublishResponseMessageName, publishContent);
    });
  }

  // TBD: We will need to create and manage the promise ourselves.
  cancelPublish() {

  }
}
