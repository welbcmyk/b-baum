import React, { Component } from "react";
import {Button, Badge, Navbar, InputGroup, FormControl, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

export default class Action extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Navbar>
                <div><Badge variant="secondary">Execute on last Item In Next Nodes</Badge></div>
                <ButtonToolbar>
                    <ButtonGroup className="mr-2"><Button variant="outline-success" onClick={this.props.onClickInsert}>Insert</Button></ButtonGroup>
                    <ButtonGroup className="mr-2"><Button variant="outline-danger" onClick={this.props.onClickDelete}>Delete</Button></ButtonGroup>
                    <ButtonGroup className="mr-2"><Button variant="outline-success" onClick={this.props.onClickInsertAll}>Insert All</Button></ButtonGroup>
                    <ButtonGroup className="mr-2"><Button variant="outline-danger" onClick={this.props.onClickDeleteAll}>Try Delete All</Button></ButtonGroup>
                    <ButtonGroup className="mr-2">
                        <InputGroup>
                            <FormControl 
                                value={this.props.searchVal}
                                placeholder="e.g. 5"
                                type="text"
                                onChange={this.props.onSearchChange}/>
                            <InputGroup.Append>
                                <Button variant="secondary" onClick={this.props.onClickSearch}>Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </ButtonGroup>
                    <ButtonGroup className="mr-2"><Button variant="outline-secondary" onClick={this.props.onClickClear}>Clear Next Nodes</Button></ButtonGroup>
                    <b>Separation:</b>
                    <InputGroup className="mr-2">
                        <RangeSlider
                        value={this.props.separationValue}
                        onChange={this.props.setSeparationValue}
                        min={1}
                        max={10}
                        step={1}
                        tooltip="off"
                        />
                    </InputGroup>
                </ButtonToolbar>
            </Navbar>
        )
    }
}