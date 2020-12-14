import React, {Component} from "react";
import {Navbar, Badge} from "react-bootstrap";

export default class NodesHistory extends Component {
    constructor(props) {
        super(props);
        this.nodeList = this.nodeList.bind(this);
    }
    nodeList() {
        if(this.props.nodeHistory.length == 0) {
            return [];
        }
        return this.props.nodeHistory.map((num,index) => {
            let type;
            switch(num.type) {
            case "none":
                type = "secondary";
                break;
            case "insert":
                type = "success";
                break;
            case "delete":
                type = "danger";
                break;
            default:
                type="secondary";
                break;
            }
            return (
                <Badge pill key={index} variant={type}>{num.numVal}</Badge>
            );
        })
    }

    render() {
        return (
            <Navbar bg="light" expand="lg">
            <Badge variant="secondary">History</Badge>
                {this.nodeList().length > 0 ? this.nodeList() : <></>}
            </Navbar>
        );
    }
}