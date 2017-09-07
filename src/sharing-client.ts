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
import * as _ from "lodash";

export interface PublicationListener {
  newPublication: (publivation: PublishResponse) => void;
}

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
  publicationListeners: PublicationListener[];

  constructor(params:SharingClientParams) {
    this.publicationListeners = [];
    if(params.phone) {
      this.phone = params.phone;
    }
    else {
      this.phone = IFramePhoneFactory.getIFrameEndpoint();
      this.phone.initialize();
    }
    this.app = params.app;
    this.phone.addListener(
      InitMessageName,
      (_context:Context) => {
        this.setContext(_context);
        this.handleInitMessage(_context);
      }
    );

    this.phone.addListener(
      PublishMessageName,
      (args:any) => this.handlePublishMessage()
    );
  }

  setContext(newContext:Context) {
    this.context = newContext;
  }

  addPublicationListener(listener:PublicationListener) {
    this.publicationListeners.push(listener);
  }

  handleInitMessage(args:Context) {
    this.sendInitResponse(args);
  }

  handlePublishMessage() {
    this.sendPublishResponse();
  }

  disconnect() {
    if(this.phone.connected) {
      this.phone.disconnect();
    }
    this.publicationListeners = [];
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
      this.notifyPublicationListeners(publishContent);
    });
  }

  notifyPublicationListeners(publishContent: PublishResponse) {
    _.each(this.publicationListeners, (l) => l.newPublication(publishContent));
  }

  // TBD: We will need to create and manage the promise ourselves.
  cancelPublish() {

  }
}
