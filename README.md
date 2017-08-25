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


## Running the demo / tester app ##
(This process could use some improvement …  )

1. Compile `npm run build`
1. from the root director run `live-server .`
2. navigate to [http://127.0.0.1:8080/src/demo/demo.html](http://127.0.0.1:8080/src/demo/demo.html)

If you want to work on the demo, then you can hack on files in  `src/demo/*` while running `webpack --watch` and keep `live-server` running,.



## Rough Messaging Diagram

![messaging diagram](sharing.jpg)
