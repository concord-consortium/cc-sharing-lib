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

export interface SharingClientParams {
  phone?: IFramePhoneUp;
  app: SharableApp;
}

export class SharingClient {
  phone: IFramePhoneUp;
  context: Context;
  app: SharableApp;

  constructor(params:SharingClientParams) {
    if(params.phone) {
      this.phone = params.phone;
    }
    else {
      this.phone = IFramePhoneFactory.getIFrameEndpoint();
      this.phone.initialize();
    }
    this.app = params.app;
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
