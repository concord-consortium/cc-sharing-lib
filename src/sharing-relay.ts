
import {
  IFramePhoneUp,
  IFramePhoneFactory,
  SharingClient,
  SharingClientParams,
  SharingParent,
  Context,
  PublishResponse,
  InitResponseMessage,
  SharableApp,
  ChildConnection,
  Representation
} from "./index";

import * as _ from "lodash";
import { v1 as uuid} from "uuid";
export interface SimplePromise {
  resolve: ()=> void;
  reject: () => void;
}
export interface PromiseRecord {
  [key:string]: SimplePromise;
}

export class SharingRelay extends SharingClient {
  calledChildren: ChildConnection[];
  connectedChildren: ChildConnection[];
  phone: IFramePhoneUp;
  childResponses: PublishResponse[];
  promiseRecords:  PromiseRecord;

  constructor(params:SharingClientParams){
    super(params);
    this.childResponses = [];
    this.promiseRecords = {};
    this.calledChildren = [];
    this.connectedChildren = [];
  }

  initializeAsTop(context:Context){
    this.setContext(context);
    this.connectAllChildren();
  }

  childFrames() {
    const frames = document.getElementsByTagName('iframe');
    return(frames);
  }

  disconnectChildren() {
    _.each(this.connectedChildren, (c) => {
      c.disconnect();
    });
    _.each(this.calledChildren, (c) => {
      c.disconnect();
    });
    this.calledChildren = [];
    this.connectedChildren = [];
  }

  disconnect() {
    this.disconnectChildren();
    super.disconnect();
  }

  connectAllChildren() {
    const frames = this.childFrames();
    _.each(frames, (f) => this.connectChild(f));
  }

  collectResponse(resp:PublishResponse) {
    this.childResponses.push(resp);
    this.promiseRecords[resp.context.id].resolve();
  }

  connectChild(iframe:HTMLIFrameElement, id?:string) {
    const iFrameId = id || uuid();
    const initCallback = (i:InitResponseMessage) => {
      const child = _.findLast(this.calledChildren, (c) => (c.id === iFrameId) );
      if(child) {
        this.connectedChildren.push(child);
      }
    };
    const childContext = _.clone(this.context)
    childContext.id = iFrameId
    const child = new ChildConnection({
      context: childContext,
      iframe: iframe,
      id: iFrameId,
      publishResponseCallback: this.collectResponse.bind(this),
      initCallback: initCallback.bind(this)
    });
    this.calledChildren.push(child);
  }

  handleInitMessage(context:Context) {
    super.handleInitMessage(context);
    if(this.calledChildren.length < 1) {
      this.connectAllChildren();
    } else {
      _.each(this.calledChildren, (ch) => ch.sendInit(context));
    }
  }

  resendInit(newContext?:Context) {
    if(newContext) {
      this.setContext(newContext);
    }
    this.handleInitMessage(this.context);
  }

  handlePublishMessage(){
    this.childResponses = [];
    this.promiseRecords = {};
    const promises = _.map(this.connectedChildren, (child) => {
      child.sendPublish();
      return new Promise( (resolve, reject) => {
        this.promiseRecords[child.context.id] = {
          resolve: resolve,
          reject: reject,
        };
      });
    });
    Promise.all(promises).then( () => this.sendPublishResponse(this.childResponses));
  }
}
