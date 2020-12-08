import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

export default class InputBar extends Component {

    render(){
        return(
            <Navbar bg="light" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    
                </Navbar.Toggle>
            </Navbar>
        )
    }
}