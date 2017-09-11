import {
  InitMessageName,
  InitResponseMessage,
  InitResponseMessageName,
  Context,
  LaunchApplication,
  PublishResponse,
  PublishMessageName,
  PublishResponseMessageName,
  Representation,
  SharableApp,
  PublicationListener
} from "./types";

import { IFramePhoneUp, IFramePhoneFactory } from "./iframe-phone";
import * as _ from "lodash";

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

  // TODO: Rename this, and add initialization handling method too.
  notifyPublicationListeners(publishContent: PublishResponse) {
    _.each(this.publicationListeners, (l) => {
      if(l.newPublication) {
        l.newPublication(publishContent);
      }
    });
  }

  // TBD: We will need to create and manage the promise ourselves.
  cancelPublish() {

  }
}
