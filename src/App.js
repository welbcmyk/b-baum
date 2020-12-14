import './App.css';

import React, {Component} from "react";
import {Alert, Button, ButtonGroup, ButtonToolbar} from "react-bootstrap";
import Tree from "react-d3-tree";

import OrderBranching from "./components/order-branching-input.component";
import InputOptions from "./components/input-options.component";
import NextNodes from "./components/next-nodes.components";
import NodesHistory from "./components/nodes-history.components";
import Action from "./components/actions.components";
import BTree from "./helpers/b-tree.helpers";

const svgSquare = {
  shape: 'rect',
  shapeProps: {
    width: 500,
    height: 40,
    fill: "white",
    stroke: "white",
    x: -80,
    y: -20,
  }
}

const text = {
  dominantBaseline: "middle",
  textAnchor: "middle"
}

const position = {
  x: 800,
  y: 60
}

class App extends Component {
  constructor(props){
    super(props);

    this.getNextNodes = this.getNextNodes.bind(this);
    this.getOrderAndBranchingOrder = this.getOrderAndBranchingOrder.bind(this);
    this.insertInTree = this.insertInTree.bind(this);
    this.deleteInTree = this.deleteInTree.bind(this);
    this.searchInTree = this.searchInTree.bind(this);
    this.shiftNextNodes = this.shiftNextNodes.bind(this);
    this.pushOnHistory = this.pushOnHistory.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.resetTree = this.resetTree.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.updateTree = this.updateTree.bind(this);
    this.clearNextNodes = this.clearNextNodes.bind(this);
    this.setSeparationValue = this.setSeparationValue.bind(this);
    this.insertAllInTree = this.insertAllInTree.bind(this);
    this.deleteAllInTree = this.deleteAllInTree.bind(this);

    this.state = {
      nextNodes: [],
      nodeHistory: [],
      treeOrder: 2,
      treeData: null,
      showAlert: false,
      alertHead: "",
      alertMessage: "",
      alertType: "",
      searchVal: "",
      currentValues: [],
      separationValue: 1
    };
    this.bTree = new BTree(this.state.treeOrder);
  }

  setSeparationValue(e){
    this.setState({
      separationValue: e.target.value
    })
  }

  hideAlert() {
    this.setState({
      showAlert: false
    })
  }

  getNextNodes = (childNextNodes) => {
    this.setState({
      nextNodes: this.state.nextNodes.concat(childNextNodes)
    });
  }

  getOrderAndBranchingOrder(order) {
    if(order == "" || order == null && order == undefined) {
      return;
    }
    if(order < 2) {
      this.setState({
        alertHead: "Reset",
        alertMessage: "The Order has to be greater than 2.",
        alertType: "danger",
        showAlert: true
      })
      return;
    }
    let alertMessage = (
      <>
        <b>Do you want to reset the Tree and copy the current Values back into the Array "Next Nodes"?</b>
        <p>
          <ButtonToolbar>
            <ButtonGroup className="mr-2">
              <Button onClick ={() => {this.hideAlert(); this.resetTree(order);}} variant="outline-secondary">Yes</Button>
            </ButtonGroup>
            <ButtonGroup className="mr-2">
              <Button onClick ={this.hideAlert} variant="secondary">No</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </p>
      </>
    )
    this.setState({
      alertHead: "Reset",
      alertMessage: alertMessage,
      alertType: "warning",
      showAlert: true
    })
  }

  insertInTree() {
    let nextNumber = this.shiftNextNodes();
    if(nextNumber == null) {
      return;
    }
    this.bTree.insert(nextNumber);
    this.setState({
      alertHead: "Insert",
      alertMessage: "Insert was successful.",
      alertType: "success",
      showAlert: true,
    });
    if(!this.state.currentValues.includes(nextNumber)) {
      this.setState({
        currentValues: this.state.currentValues.concat(nextNumber)
      });
      this.pushOnHistory(nextNumber, "insert");
    }
    this.updateTree();
  }

  deleteInTree() {
    let nextNumber = this.shiftNextNodes();
    if(nextNumber == null) {
      return;
    }
    let alertMessage = "Deletion was successful.";
    let alertType = "success";
    if(!this.bTree.delete(nextNumber)) {
      alertMessage = "Value could not be deleted. Maybe its not in the tree.";
      alertType = "danger";
    } else {
      let currentValues = this.state.currentValues;
      currentValues.splice(this.state.currentValues.indexOf(nextNumber), 1)
      this.setState({
        currentValues: currentValues
      });
      this.pushOnHistory(nextNumber, "delete");
    }
    this.setState({
      alertHead: "Delete",
      alertMessage: alertMessage,
      alertType: alertType,
      showAlert: true
    });
    this.updateTree();
  }

  insertAllInTree() {
    let insertedNodes = [];
    this.state.nextNodes.forEach(node => {
        this.bTree.insert(node);
        if(!this.state.currentValues.includes(node)) {
          this.setState({
            currentValues: this.state.currentValues.concat(node),
          });
          insertedNodes.push(node);
        }
    });
    this.pushOnHistory(insertedNodes, "insert");
    this.setState({
      alertHead: "Insert",
      alertMessage: "All values got inserted.",
      alertType: "success",
      showAlert: true,
      nextNodes: []
    })
    this.updateTree();
  }

  deleteAllInTree() {
    const valuesToDelete = this.state.nextNodes.length;
    let failedDeletions = [];
    let successfulDeletions = [];
    this.state.nextNodes.forEach(node => {
        if(!this.bTree.delete(node)) {
          failedDeletions.push(node);
        } else {
          successfulDeletions.push(node);
          if(this.state.currentValues.includes(node)) {
            let currentValues = this.state.currentValues;
            currentValues.splice(this.state.currentValues.indexOf(node), 1);
            this.setState({
              currentValues: currentValues
            });
          }
        }
    });
    this.pushOnHistory(successfulDeletions, "delete");
    this.setState({
      alertHead: (failedDeletions.length == 0 ? "All Elements deleted" : valuesToDelete-failedDeletions.length + " of " + valuesToDelete + " deleted"),
      alertMessage: (failedDeletions.length == 0 ? "All values got deleted." : "These values could not be deleted: " + failedDeletions.join(", ") + "."),
      alertType: (failedDeletions.length == 0 ? "success" : (failedDeletions.length == valuesToDelete ? "danger" : "warning")),
      showAlert: true,
      nextNodes: []
    })
    this.updateTree();
  }

  searchInTree() {
    let searchVal = this.state.searchVal;
    let depthObj = {
      depth: 0
    }
    if(searchVal == null) {
      return;
    }
    let res = this.bTree.searchVal(this.bTree.root, parseInt(searchVal, 10), depthObj);
    let alertMessage = "";
    let alertType = "success";
    if(res === null) {
      alertMessage = "Could not find Value.";
      alertType = "danger";
    } else {
      alertMessage = "Search was successful. At Node " + res.values.join("|") + " with a cost of " + depthObj.depth + ".";
    }
    this.setState({
      alertHead: "Search",
      alertMessage: alertMessage,
      alertType: alertType,
      showAlert: true,
    });
  }

  shiftNextNodes() {
    if(this.state.nextNodes.length == 0){
      return null;
    }
    let nextNumber = this.state.nextNodes[0];
    this.setState({
      nextNodes: this.state.nextNodes.slice(1)
    })
    return nextNumber;
  }

  pushOnHistory(num, type) {
    let data = [];
    num = [num];
    num.flat(Infinity);
    num = [].concat.apply([], num);
    num.forEach(element => {
      data.push({
        numVal: element,
        type: type
      });
    });
    this.setState({
      nodeHistory: data.concat(this.state.nodeHistory)
    });
  }

  onSearchChange(e) {
    this.setState({
      searchVal: e.target.value
    });
  }

  resetTree(order) {
    const currentValues = this.state.currentValues;
    this.setState({
      nextNodes: currentValues.concat(this.state.nextNodes),
      currentValues: [],
      order: order,
      nodeHistory: []
    });
    this.bTree = new BTree(parseInt(order, 10));
    this.updateTree();
  }

  updateTree() {
    this.setState({
      treeData: this.bTree.toJSON()
    });
  }

  clearNextNodes() {
    this.setState({
      nextNodes: []
    })
  }

  render() {
    return (
      <>
        <Alert show={this.state.showAlert} variant={this.state.alertType} onClose={() => this.setState({showAlert:false})} dismissible>
          <Alert.Heading>{this.state.alertHead}</Alert.Heading>
          <p>{this.state.alertMessage}</p>
        </Alert>
        <OrderBranching getOrderAndBranchingOrder={this.getOrderAndBranchingOrder}/>
        <InputOptions getNextNodes={this.getNextNodes}/>
        <NodesHistory nodeHistory={this.state.nodeHistory}/>
        <NextNodes nextNodes={this.state.nextNodes}/>
        <Action
        onClickInsert={this.insertInTree}
        onClickClear={this.clearNextNodes}
        onClickDelete={this.deleteInTree}
        onClickSearch={this.searchInTree}
        onClickDeleteAll={this.deleteAllInTree}
        onClickInsertAll={this.insertAllInTree}
        onSearchChange={this.onSearchChange}
        searchVal={this.state.searchVal}
        setSeparationValue={this.setSeparationValue}
        separationValue={this.state.separationValue}
        />
        {this.state.treeData != null ? 
        <div id="treeWrapper" style={{width: '500em', height: '500em'}}>
          <Tree 
          data={this.state.treeData}
          orientation="vertical" 
          collapsible={false} 
          nodeSvgShape={svgSquare} 
          pathFunc={"straight"} 
          textLayout={text} 
          translate={position} 
          zoomable={true} 
          separation={{siblings: parseInt(this.state.separationValue, 10), nonSiblings: parseInt(this.state.separationValue, 10)}}/>
        </div>
        : <> </>
        }
      </>
    );
  }
}

if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

export default App;
