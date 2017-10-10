import {
  InitMessageName,
  InitResponseMessage,
  InitResponseMessageName,
  Context,
  LaunchApplication,
  PublishResponse,
  PublishMessageName,
  PublishResponseMessageName,
  PublishFailMessage,
  PublishFailMessageName,
  Representation,
  SharableApp,
  PublicationListener
} from "./types";
import { v1 as uuid  } from "uuid";
import { IFramePhoneUp, IFramePhoneFactory } from "./iframe-phone";
import { merge, pick, omit, each } from "lodash";
import { Version } from "./version";

export interface SharingClientParams {
  phone?: IFramePhoneUp;
  app: SharableApp;
}

export type PublishResponseFilter = (unfiltered:PublishResponse) => PublishResponse

export class SharingClient {
  phone: IFramePhoneUp;
  context: Context;
  app: SharableApp;
  completedInit: boolean;
  publicationListeners: PublicationListener[];
  failPublishFunc?(reason:any): void;
  private publishResponseFilter:PublishResponseFilter|null

  constructor(params:SharingClientParams) {
    this.completedInit = false;
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
        this.handleInitMessage(_context);
      }
    );

    this.phone.addListener(
      PublishMessageName,
      (args:any) => this.handlePublishMessage()
    );
  }

  getApplication():LaunchApplication {
    if (typeof this.app.application === "function") {
      return this.app.application()
    }
    return this.app.application
  }

  setContext(parentContext:Context) {
    const uniq = uuid();
    const localProps = ['id'];
    const defaults = {
      protocolVersion: Version,
      requestTime: new Date().toISOString(),
      id: uniq
    };
    this.context = merge(defaults, parentContext, pick(this.context, localProps)) as Context;
  }


  addPublicationListener(listener:PublicationListener) {
    this.publicationListeners.push(listener);
  }

  setPublishResponseFilter(publishResponseFilter:PublishResponseFilter) {
    this.publishResponseFilter = publishResponseFilter;
  }

  filterPublishResponse(unfiltered:PublishResponse, callback: (filtered:PublishResponse) => void) {
    if (this.publishResponseFilter) {
      callback(this.publishResponseFilter(unfiltered))
    }
    else {
      callback(unfiltered)
    }
  }

  handleInitMessage(parentContext:Context) {
    this.setContext(parentContext);
    if(this.app.initCallback) {
      this.app.initCallback(this.context);
    }
    // We only want to send the initResponse once.
    // Otherwise we confuse the sharing-relay.
    // we might receive a second init message when context has changed.
    if(!this.completedInit) {
      this.sendInitResponse(this.context);
      this.completedInit =true;
    }
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
      id: this.context.id,
      Application: this.getApplication()
    };
    this.phone.post(InitResponseMessageName, initResponse);
  }


  sendPublishResponse(children:PublishResponse[]=[]) {
    const promise = this.app.getDataFunc(this.context);
    return promise
      .then((representations) => {
        const publishContent:PublishResponse = {
          context: this.context,
          createdAt: new Date().toISOString(),
          application: this.getApplication(),
          representations: representations,
          children: children
        };
        this.filterPublishResponse(publishContent, (filteredPublishContent) => {
          this.phone.post(PublishResponseMessageName, publishContent);
          this.notifyPublicationListeners(publishContent);
        })
      })
      .catch((reason:any) => this.failPublish(reason));
  }

  log(msg:any) {
    if(console && console.log) {
      console.log(msg);
    }
  }

  failPublish(reason:any) {
    this.log("💀 failure to publish");
    this.log(reason);
    if(this.failPublishFunc) {
      this.failPublishFunc(reason);
    }
    this.phone.post(PublishFailMessageName, {reason:reason} );
  }

  setFailPublishFunc(func:(m:any)=>void) {
    this.failPublishFunc = func;
  }

  // TODO: Rename this, and add initialization handling method too.
  notifyPublicationListeners(publishContent: PublishResponse) {
    each(this.publicationListeners, (l) => {
      if(l.newPublication) {
        l.newPublication(publishContent);
      }
    });
  }

  // TODO: We will need to create and manage the promise ourselves.
  cancelPublish() {

  }

}
