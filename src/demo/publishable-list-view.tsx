
import * as React from "react";
import * as ReactDOM from "react-dom";


import { PublishResponse, Representation, Text, Jpeg} from "../index";
import * as _ from "lodash";
import * as moment from "moment";

export interface PublishableListViewProps {
  snapshots: PublishResponse[];
}

export interface PublishableListViewState {

}

export class PublishableListView extends React.Component<PublishableListViewProps, PublishableListViewState> {
  public state:PublishableListViewState;

  constructor(props:PublishableListViewProps){
    super(props);
  }

  renderRep(rep:Representation) {
    let repElm = <div/>;
    if(rep.type.type === Jpeg.type) {
      repElm = <img src={rep.dataUrl} className="rep-thumbnail"/>;
    }
    if(rep.type.type === Text.type) {
      repElm = <span>{rep.dataUrl}</span>;
    }
    return(
      <div>
        {repElm}
      </div>
    );
  }

  renderChild(child: PublishResponse) {
    const name:string = child.application.name;
    const url:string  = child.application.launchUrl;

    return(
      <div style={{marginRight:"1em", marginLeft:"1em"}}>
        <div> <a href={url} target="_blank">{name}</a></div>
        { _.map(child.representations, (rep:Representation) => this.renderRep(rep)) }
      </div>
    );
  }

  renderSnapshot(snapshot: PublishResponse) {
    const time:string = moment(snapshot.createdAt).calendar();
    const name:string = snapshot.application.name;
    const url:string  = snapshot.application.launchUrl;
    const component:JSX.Element=
      <div className="representation">
        <div> <span>{time}</span> <a href={url} target="_blank">{name}</a></div>
        { _.map(snapshot.representations, (rep:Representation) => this.renderRep(rep)) }
        { _.map(snapshot.children, (child:PublishResponse) => this.renderChild(child)) }
      </div>;
    return component;
  }

  render() {
    const snapshots = this.props.snapshots;
    return(
        <div className="published-container">
          { _.reverse(_.map(snapshots, (snap:PublishResponse) => this.renderSnapshot(snap))) }
        </div>
    );
  }
}
