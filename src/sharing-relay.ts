
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

  childFrames() {
    return(document.getElementsByTagName('iframe'));
  }

  disconnectAllChildren() {
    _.each(this.calledChildren, (c) => {
      c.disconnect();
    });
    this.calledChildren = [];
  }

  connectAllChildren() {
    const frames = this.childFrames();
    _.each(frames, (f) => this.connectChild(f));
  }

  collectResponse(resp:PublishResponse) {
    this.childResponses.push(resp);
    this.promiseRecords[resp.context.id].resolve();
  }

  connectChild(iframe:HTMLIFrameElement) {
    const initCallback = (i:InitResponseMessage) => {
      const child = _.findLast(this.calledChildren, (c) => c.context.id === i.id);
      if(child) {
        this.connectedChildren.push(child);
      }
    };
    const child = new ChildConnection({
      context: this.context,
      iframe: iframe,
      publishResponseCallback: this.collectResponse.bind(this),
      initCallback: initCallback.bind(this)
    });
    this.calledChildren.push(child);
  }

  handleInitMessage(args:Context) {
    super.handleInitMessage(args);
    this.connectAllChildren();
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
    super.handlePublishMessage();
  }
}
