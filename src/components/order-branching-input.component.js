import { Component } from "react";
import {Navbar, InputGroup, FormControl, Button} from "react-bootstrap";

export default class OrderBranching extends Component {
    constructor(props){
        super(props);
        this.onChangeOrderValue = this.onChangeOrderValue.bind(this);
        this.onClickSetValues = this.onClickSetValues.bind(this);
        this.state = {
            orderValue: null
        }
    }

    onChangeOrderValue(e){
        this.setState({
            orderValue: e.target.value
        });
    }

    onClickSetValues() {
        this.props.getOrderAndBranchingOrder(this.state.orderValue);
    }

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
                        value={this.state.orderValue}
                        onChange={this.onChangeOrderValue}
                        placeholder="default 1 (this would mean min 1 value and max 2 values in one node)"
                        type="text"
                        />
                    </InputGroup>
                </div>
                <div class="col-2">
                    <Button variant="outline-dark" onClick={this.onClickSetValues}>Set Value</Button>
                </div>
                <div class="col-4"></div>
            </Navbar>
        );
    }
}