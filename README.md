## cc-sharing client library ##

To be used by clients of the CC [Sharintor](https://github.com/concord-consortium/sharinator)

This library defines [iFramePhone](https://github.com/concord-consortium/iframe-phone) message signatures
for the purpose of 'sharing' work between students and teachers.

## Details ##

There are only 3 message types defined:

1. `SharinatorInit`
    * Sends data about the session in `sharing-init` format
2. `SharinatorPublish`
    * User intiated request for new data.
3. `SharinatorPublishResponse`
    * Contents of publishable data in `Publishable` format.


## To Build: ##
1. Install dependencies: `yarn`
2. Compile `npm run build`


## Using this library
All of this subject to change out of the blue. As of 2017-09-06 the easiest / best thing to do
is something like this:

```
    const app:SharableApp = {
        // Describe the application:
        application: {
            launchUrl: "http://127.0.0.1:8080/src/demo/iframe.html",
            name: "demo iframe app"
        },

        getDataFunc: (context) => {
            // 1. Construct a unique url from the sharing context:
            const dataUrl = `${context.group.id}-${context.offering.id}-${context.user.id}`;
            // 2. The promise constructs a list of data Represnetations:
            return new Promise((resolve, reject) => {
                resolve([
                {
                    type: Text,
                    dataUrl: `this is the iframe response at ${new Date()}`
                }
                ]);
            });
        }
    };

    // Pass in an existing phone as first arg if you want to reuse it.
    const sharePhone = new SharingRelay(null, app);

```

## Running the demo & tester app ##

You can view an [online demo](http://sharing-demo.concord.org/branch/master/demo.html).

Deployment happens automagically using travis and `branch/<branchname>` urls.
Production branch goes to [http://sharing-demo.concord.org/demo.html](http://sharing-demo.concord.org/branch/master/demo.html)

## Running a local demo & tester app ##
(This process could use some improvement …  )

1. Compile `npm run build`
1. from the root director run `live-server .`
2. navigate to [http://127.0.0.1:8080/src/demo/demo.html](http://127.0.0.1:8080/src/demo/demo.html)

If you want to work on the demo, then you can hack on files in  `src/demo/*` while running `webpack --watch` and keep `live-server` running,.



## Rough Messaging Diagram

![messaging diagram](sharing.jpg)
