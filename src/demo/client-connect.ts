import { SharingClient, SharableApp, IFramePhone, Binary, Jpeg } from "../index"
declare const require:(name:string) => any
const iFramePhone = require("iframe-phone")

export const connect = function() {
  const phone:IFramePhone = iFramePhone.getIFrameEndpoint();
  phone.addListener('testMessage', function(content:any){
    console.log("received message");
    console.log(content);
    phone.post("yes", "yes");
  });
  phone.initialize();
  const app:SharableApp = {
    application: {
      launchUrl: "http://blarg.com",
      name: "drawing demo"
    },
    getDataFunc: () => {
      console.log("bugga")
      return [
        {
          type: Binary,
          dataUrl: "http://foo.bar.com/"
        },
        {
          type: Jpeg,
          dataUrl: "http://foo.bar.com/foo.jpg"
        }
      ]
    }
  }
  const sharePhone = new SharingClient(phone, app);
};