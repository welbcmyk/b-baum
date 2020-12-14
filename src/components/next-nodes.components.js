import React, {Component} from "react";
import {Navbar, Badge} from "react-bootstrap";

export default class NextNodes extends Component {
    constructor(props) {
        super(props);
        this.nodeList = this.nodeList.bind(this);
    }
    nodeList() {
        if(this.props.nextNodes.length == 0) {
            return [];
        }
        return this.props.nextNodes.map((num, index) => {
            return (
                <Badge pill key={index} variant="secondary">{num}</Badge>
            );
        })
    }

    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Badge variant="secondary">Next Nodes</Badge>
                {this.nodeList().length > 0 ? this.nodeList() : <></>}
            </Navbar>
        );
    }
}