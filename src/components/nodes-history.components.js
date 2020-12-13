import React, {Component} from "react";
import {Navbar, Badge} from "react-bootstrap";

export default class NodesHistory extends Component {
    constructor(props) {
        super(props);
        this.nodeList = this.nodeList.bind(this);
    }
    nodeList() {
        if(this.props.historyNodes.length == 0) {
            return [];
        }
        return this.props.historyNodes.map((num) => {
            let type;
            if(num.type == "none") {
                type = "secondary";
            }
            if(num.type == "insert") {
                type = "success";
            }
            if(num.type == "delete") {
                type = "danger";
            }
            return (
                <Badge pill variant={type}>{num.valueNum}</Badge>
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