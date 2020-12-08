import { Component } from "react";
import {Navbar, InputGroup, FormControl, Button} from "react-bootstrap";

export default class OrderBranching extends Component {
    render() {
        return (
            <Navbar bg="light" expand="lg" class="row">
                <div class ="col-3">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                Order &nbsp;<i>m</i>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        value={this.props.orderValue}
                        placeholder="e.g. 2"
                        type="text"
                        />
                    </InputGroup>
                </div>
                <div class ="col-3">
                    <InputGroup class="col-3 px-5">
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                Branching Order &nbsp;<i>k</i>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        value={this.props.branchingOrderValue}
                        placeholder="e.g. 2"
                        type="text"
                        />
                    </InputGroup>
                </div>
                <div class="col-2">
                    <Button variant="outline-dark" onClick={this.props.onSetValues}>Set Values</Button>
                </div>
                <div class="col-4"></div>
            </Navbar>
        );
    }
}