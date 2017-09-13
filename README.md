## cc-sharing client library ##

To be used by clients of the CC [Sharintor](https://github.com/concord-consortium/sharinator)

This library defines [iFramePhone](https://github.com/concord-consortium/iframe-phone) message signatures
for the purpose of 'sharing' work between students and teachers.

## Details ##

There are four message types defined:

1. `SharinatorInit`
    * Sends data about the session in `sharing-init` format
1. `SharinitorInitResponse`
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
    const context:Context = {
        protocolVersion: "1.0.0",
        user: {displayName: "noah", id:"1"},
        id: uuid.v1(),
        group: {displayName: "noahs group", id:"1"},
        offering: {displayName: "offering_id", id: "1"},
        clazz:  {displayName: "clazz_id", id: "1"},
        localId: "x",
        requestTime: new Date().toISOString()
    };

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
    sharing = new SharingRelay({app:app});
    const receivePub = (snapshot:PublishResponse) => console.log(snapshot);
    sharing.addPublicationListener({newPublication: receivePub});
    sharing.initializeAsTop(context);

```

## Running the demo & tester app ##

You can view an [online demo](http://sharing-demo.concord.org/branch/master/index.html).

You can epxierment with that demo by cloning the gihub repo [cc-sharing-demo](https://github.com/concord-consortium/cc-sharing-demo)

See that README document for more info.


## Rough Messaging Diagram

![messaging diagram](sharing.jpg)
