import { Component } from "react";
import {Navbar, InputGroup, FormControl, Button} from "react-bootstrap";

function ImportFile(props) {
    let fileReader;

    const handleFileRead = () => {
        const content = fileReader.result;
        props.callback(content);
        console.log(content);
    };

    const handleFileChange = (file) => {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    };

    return (
        <InputGroup>
            <FormControl
            type="file"
            onChange={e => handleFileChange(e.target.files[0])}
            accept='.csv'
            id='file'
            />
        </InputGroup>
    )

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class InputOptions extends Component {
    constructor(props) {
        super(props);
        
        this.onNewNumbersChange = this.onNewNumbersChange.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.onClickAddTextInput = this.onClickAddTextInput.bind(this);
        this.onClickAddFileInput = this.onClickAddFileInput.bind(this);
        this.onClickGenerateAndAdd = this.onClickGenerateAndAdd.bind(this);
        this.onBottomBorderChange = this.onBottomBorderChange.bind(this);
        this.onTopBorderChange = this.onTopBorderChange.bind(this);
        this.onNumOfNodesChange = this.onNumOfNodesChange.bind(this);

        this.state = {
            newNumbersTextInput: "",
            newNumbersFileInput: null,
            numOfNewNumbers: null,
            bottomBorder: null,
            topBorder: null
        };
    }

    callbackToFileInput = (fileData) => {
        this.setState({
            newNumbersFileInput: fileData
        });
    }

    onNewNumbersChange(e) {
        this.setState({
            newNumbersTextInput: e.target.value,
        });
    }

    onClickAddTextInput() {
        let nextNums = this.state.newNumbersTextInput.split(',').map(function(item) {
            return parseInt(item.trim());
        });
        this.props.getNextNodes(nextNums);
        this.setState({
            newNumbersTextInput: ""
        });
    }

    onClickAddFileInput() {
        let nextNums = this.state.newNumbersFileInput.split(',').map(function(item) {
            return parseInt(item.trim());
        });
        this.props.getNextNodes(nextNums);
    }

    onFileChange(e) {

        this.setState({
            newNumbersFileInput: e.target.value
        });
        console.log(e.target.files[0]);
    }

    onNumOfNodesChange(e) {
        this.setState({
            numOfNewNumbers: e.target.value,
        });
    }

    onTopBorderChange(e) {
        this.setState({
            topBorder: e.target.value,
        });
    }

    onBottomBorderChange(e) {
        this.setState({
            bottomBorder: e.target.value,
        });
    }

    onClickGenerateAndAdd() {
        let randNums = [];
        for ( let index = 0; index < this.state.numOfNewNumbers; index++) {
            let randNum;
            do {
                randNum = getRandomInt(this.state.bottomBorder, this.state.topBorder);
            } while(randNums.includes(randNum))
            randNums.push(randNum);
        }
        this.props.getNextNodes(randNums);
    }
    
    render() {
        return (
            <>
                <Navbar bg="light" expand="lg" class="row">
                    <div class="col-5">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    New Nodes
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            value={this.state.newNumbersTextInput}
                            placeholder="e.g. 5, 15, 89"
                            type="text"
                            onChange={this.onNewNumbersChange}
                            />
                            <InputGroup.Append>
                                <Button onClick={this.onClickAddTextInput}>
                                    Add
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div> 
                    <div class="col-7"></div>
                </Navbar>
                <Navbar bg="light" expand="lg" class="row">
                    <ImportFile class="col-2" content={this.state.newNumbersFileInput} callback={this.callbackToFileInput}/>
                    <Button class="col-1" onClick={this.onClickAddFileInput}>
                        Add
                    </Button>
                    <div class="col-9"></div>
                </Navbar>
                <Navbar bg="light" expand="lg" class="row">
                    <div class ="col-3">
                        <InputGroup class ="col-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    # of Nodes
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            value={this.state.numOfNewNumbers}
                            placeholder="e.g. 5"
                            type="text"
                            onChange={this.onNumOfNodesChange}
                            />
                        </InputGroup>
                    </div>
                    <div class ="col-3">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    Bottom Border
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            value={this.state.bottomBorder}
                            placeholder="e.g. 3"
                            type="text"
                            onChange={this.onBottomBorderChange}
                            />
                        </InputGroup>
                    </div>
                    <div class ="col-3">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    Top Border
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            value={this.state.topBorder}
                            placeholder="e.g. 15"
                            type="text"
                            onChange={this.onTopBorderChange}
                            />
                        </InputGroup>
                    </div>
                    <div class="col-3">
                        <Button variant="outline-primary" onClick={this.onClickGenerateAndAdd}>
                            Generate & Add
                        </Button>
                    </div>
                </Navbar>
            </>
        );
    }
}