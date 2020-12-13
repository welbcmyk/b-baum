import './App.css';

import React, {Component} from "react";
import {Alert} from "react-bootstrap";
import Tree from "react-d3-tree";

import OrderBranching from "./components/order-branching-input.component";
import InputOptions from "./components/input-options.component";
import NextNodes from "./components/next-nodes.components";
import NodesHistory from "./components/nodes-history.components";
import Action from "./components/actions.components";

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

const separation = {
  siblings: 2,
  nonSiblings: 2
}

class App extends Component {
  constructor(props){
    super(props);

    this.getNextNodes = this.getNextNodes.bind(this);
    this.getOrderAndBranchingOrder = this.getOrderAndBranchingOrder.bind(this);
    this.insertInTree = this.insertInTree.bind(this);
    this.deleteInTree = this.deleteInTree.bind(this);
    this.searchInTree = this.searchInTree.bind(this);
    this.deleteAllInTree = this.deleteAllInTree.bind(this);
    this.insertAllInTree = this.insertAllInTree.bind(this);
    this.shiftNextNodes = this.shiftNextNodes.bind(this);
    this.pushOnHistory = this.pushOnHistory.bind(this);

    this.state = {
      nextNodes: [],
      nodeHistory: [],
      treeOrder: 1,
      treeData: null,
      showAlert: true,
      alertHead: "Test",
      alertMessage: "hi",
      alertType: "success"
    };
  }

  getNextNodes = (childNextNodes) => {
    this.setState({
      nextNodes: this.state.nextNodes.concat(childNextNodes)
    });
  }

  getOrderAndBranchingOrder(order) { // TODO: add reset tree function if tree is not empty // error
    console.log(order);
    this.setState({
      treeOrder: order
    })
  }

  insertInTree() {
    let nextNumber = this.shiftNextNodes();
    if(nextNumber == null) {
      return;
    }
    
  }

  insertAllInTree() {
    while(this.state.nextNodes.length > 0) {
      this.insertInTree();
    }
  }

  deleteInTree() {
    // TODO: delete
  }

  deleteAllInTree() {
    while(this.state.nextNodes.length > 0) {
      this.deleteInTree();
    }
  }

  searchInTree() {
    // TODO: search
  }

  shiftNextNodes() {
    if(this.state.nextNodes.length == 0){
      return null;
    }
    let nextNumber = this.state.nextNodes[0];
    this.setState({
      nextNodes: this.state.nextNodesLocal.slice(1)
    })
    return nextNumber;
  }

  pushOnHistory(num, type) {
    let data = {
      num: num,
      type: type
    }
    this.setState({
      nodeHistory: data
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
        <NodesHistory historyNodes={this.state.nodeHistory}/>
        <NextNodes nextNodes={this.state.nextNodes}/>
        <Action
        onClickInsert={this.insertInTree}
        onClickInsertAll={this.insertAllInTree}
        onClickDelete={this.deleteInTree}
        onClickDeleteAll={this.deleteAllInTree}
        onClickSearch={this.searchInTree}
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
          zoomable={false} 
          separation={separation}/>
        </div>
        : <> </>
        }
      </>
    );
  }
}

export default App;
