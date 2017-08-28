import { Representation, SharingClient, SharableApp, IFramePhone, Binary, Jpeg } from "../index";
declare const require:(name:string) => any;
const iFramePhone = require("iframe-phone");

export const demoClientConnect = function() {
  const phone:IFramePhone = iFramePhone.getIFrameEndpoint();
  phone.initialize();

  const app:SharableApp = {
    // Describe the application:
    application: {
      launchUrl: "http://127.0.0.1:8080/src/demo/client.html",
      name: "demo app"
    },
    // Provide a callback that returns a promise that resolves to a list of
    // data Represenations.
    getDataFunc: (context) => {
      // 1. Construct a unique url from the sharing context:
      const dataUrl = `${context.groupId.id}-${context.offeringId.id}-${context.userId.id}`;
      // 2. The promise constructs a list of data Represnetations:
      return new Promise((resolve, reject) => {
        resolve([
          {
            type: Binary,
            dataUrl: `http://foo.bar.com/#${dataUrl}`
          },
          {
            type: Jpeg,
            dataUrl: `http://foo.bar.com/#${dataUrl}.jpg`
          }
        ]);
      });
    }
  };
  const sharePhone = new SharingClient(phone, app);
};
