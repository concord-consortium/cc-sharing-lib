import {
  InitMessageName,
  InitResponseMessage,
  InitResponseMessageName,
  Context} from "./init-message";
import {
  LaunchApplication,
  PublishResponse,
  PublishMessageName,
  PublishResponseMessageName,
  Representation} from "./publishable";

import { IFramePhoneUp, IFramePhoneFactory } from "./iframe-phone";


export interface SharableApp {
  application: LaunchApplication;
  getDataFunc(context:Context): Promise<Representation[]>;
}

export class SharingClient {
  phone: IFramePhoneUp;
  context: Context;
  app: SharableApp;

  constructor(phone:IFramePhoneUp|null, app:SharableApp) {
    if(phone !== null) {
      this.phone = phone;
    }
    else {
      console.log("Creating iframe phone");
      this.phone = IFramePhoneFactory.getIFrameEndpoint();
      this.phone.initialize();
    }
    this.app = app;
    // For now assume that its ready to add listeners … (TBD)
    this.phone.addListener(
      InitMessageName,
      (args:Context) => {
        this.context = args;
        this.handleInitMessage(args);
      }
    );

    this.phone.addListener(
      PublishMessageName,
      (args:any) => this.handlePublishMessage()
    );
  }

  handleInitMessage(args:Context) {
    this.sendInitResponse(args);
  }

  handlePublishMessage() {
    this.sendPublishResponse();
  }

  sendInitResponse(args:Context) {
    const initResponse:InitResponseMessage = {
      localId: this.context.localId,
      id: this.context.id,
      Application: this.app.application
    };
    console.log("sending init response");
    this.phone.post(InitResponseMessageName, initResponse);
  }

  sendPublishResponse(children:PublishResponse[]=[]) {
    const promise = this.app.getDataFunc(this.context);
    return promise.then((representations) => {
      const publishContent:PublishResponse = {
        context: this.context,
        createdAt: new Date().toISOString(),
        application: this.app.application,
        representations: representations,
        children: children
      };
      this.phone.post(PublishResponseMessageName, publishContent);
    });
  }

  // TBD: We will need to create and manage the promise ourselves.
  cancelPublish() {

  }
}
