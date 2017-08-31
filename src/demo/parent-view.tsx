import * as React from "react";
import * as ReactDOM from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { PublishableListView } from "./publishable-list-view";

const iframePhone = require("iframe-phone");
const uuid = require("uuid");

import {
  Context,
  SharingParent,
  IFramePhone,
  Publishable } from "../index";

export interface PhoneTestProps {}
export interface PhoneTestState {
  url: string;
  connected: boolean;
  lastMessageType: string;
  snapshots: Publishable[];
}

export class PhoneTestView extends React.Component<PhoneTestProps, PhoneTestState> {
  public state:PhoneTestState;
  phone: IFramePhone;
  sharePhone: SharingParent;

  constructor(props:PhoneTestProps){
    super(props);
    this.state = {
      url: "client.html",
      connected: false,
      lastMessageType: "(none)",
      snapshots: []
    };
  }

  componentDidMount() {
    this.setupPhone();
  }

  componentDidUpdate(prevProps:PhoneTestProps,prevState:PhoneTestState) {
    const lastUrl = prevState.url;
    const thisUrl = this.state.url;
    if(lastUrl !== thisUrl) {
      this.setupPhone();
    }
  }

  setupPhone() {
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

    const receivePub = (snapshot:Publishable) => {
      console.log(snapshot);
      const snapshots = this.state.snapshots;
      snapshots.push(snapshot);
      this.setState(
        {
          snapshots: snapshots,
          lastMessageType: "pub"
        }
      );
    };

    if(this.phone) {
      this.phone.disconnect();
    }
    this.phone = iframePhone.ParentEndpoint(this.refs.iframe, this.connectionComplete.bind(this));
    this.sharePhone = new SharingParent(this.phone, context, receivePub);
    console.log('setupPhone done');
  }

  connectionComplete() {
    this.setState({connected: true});
  }

  render() {
    const url = this.state.url;
    const connectionStatus = this.state.connected ? "Connected" : "Disconnected";
    const lastMessage = this.state.lastMessageType;
    const snapshots = this.state.snapshots;
    const clickHandler = this.sharePhone ? () => this.sharePhone.sendPublish() :() => console.log("dang");
    return(
      <MuiThemeProvider>
        <div className="container">
          <div className="controls">
            <div>
              <RaisedButton onClick={clickHandler}> Publish </RaisedButton>
            </div>
            <div>
              <TextField
                hintText="http://localhost:8081/index.html"
                floatingLabelText="iFrame Url"
                value={url}
                onChange={ (target,newvalue) => this.setState({url:newvalue})}
                />
            </div>
            <div>
              <span> Phone Status:</span>
              <span> {connectionStatus} </span>
            </div>
            <PublishableListView snapshots={snapshots} />
          </div>
          <iframe ref='iframe' width={400} height={400} src={url}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<PhoneTestView/>, document.getElementById("App"));
