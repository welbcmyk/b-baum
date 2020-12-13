import React, { Component } from "react";
import {Button, Badge, Navbar} from "react-bootstrap";

export default class Action extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Navbar>
                <div><Badge>Execute on last Item In History</Badge></div>
                <div><Button variant="outline-success" onClick={this.props.onClickInsert}>Insert</Button></div>
                <div><Button variant="outline-success" onClick={this.props.onClickInsertAll}>Insert All</Button></div>
                <div><Button variant="outline-danger" onClick={this.props.onClickDelete}>Delete</Button></div>
                <div><Button variant="outline-danger" onClick={this.props.onClickDeleteAll}>Delete All</Button></div>
                <div><Button variant="outline-primary" onClick={this.props.onClickInsert}>Search</Button></div>
            </Navbar>
        )
    }
}