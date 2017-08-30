
import {
  IFramePhone,
  IFramePhoneLib,
  SharingClient,
  SharingParent,
  InitMessage,
  Publishable,
  SharableApp
} from "./index";

import * as _ from "lodash";
import { v1 as uuid} from "uuid";

const IFramePhoneImp:IFramePhoneLib = require("iframe-phone");

class SharingRelay extends SharingClient{
  toChildren: SharingParent[];
  phone: IFramePhone;

  childFrames() {
    return(document.getElementsByTagName('iframe'));
  }

  disconnectAllChildren() {
    _.each(this.toChildren, (c:SharingParent) => {
      c.phone.disconnect();
    });
    this.toChildren = [];
  }

  rebroadcast(p:Publishable) {
    this.sendPublish(p);
  }
  connectChild(iframe:HTMLIFrameElement) {
    const childPhone = IFramePhoneImp.ParentEndpoint(iframe, ()=> console.log("connecting iframe"));
    const newContext:InitMessage = _.clone(this.context);
    newContext.localId = uuid();
    this.toChildren.push(new SharingParent(childPhone, newContext, this.rebroadcast.bind(this));
  }

  constructor(phone:IFramePhoneLib|null, app:SharableApp){
    super(phone,app);
  }
}