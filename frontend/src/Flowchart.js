import React, { useState, useCallback } from "react";
import ReactFlow, { addEdge, Controls, MiniMap, applyNodeChanges, applyEdgeChanges, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";

// Initial nodes and edges
const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Cold Email" },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [];

const Flowchart = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for general add node menu visibility
  const [nodeMenuPosition, setNodeMenuPosition] = useState(null); // Position of node-specific menu
  const [plusButtonPosition, setPlusButtonPosition] = useState({ x: 50, y: 50 }); // Position of the plus button
  const [selectedNode, setSelectedNode] = useState(null); // Track the selected node

  // Handle new edge creation
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Handle removing nodes and edges
  const onElementsRemove = useCallback(
    (elementsToRemove) => {
      const newNodes = applyNodeChanges(elementsToRemove, nodes);
      const newEdges = applyEdgeChanges(elementsToRemove, edges);
      setNodes(newNodes);
      setEdges(newEdges);
    },
    [nodes, edges]
  );

  // Add new node with random position
  const addNode = (type) => {
    const newNode = {
      id: String(nodes.length + 1),
      data: { label: type },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    };
    setNodes((nds) => [...nds, newNode]);
    setIsMenuOpen(false); // Close the general menu after adding a node
  };

  // Handle saving the flow
  const handleSaveFlow = () => {
    console.log({ nodes, edges });
  };

  // Handle node click to display the node-specific menu
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node); // Set the clicked node as selected
    setNodeMenuPosition({
      x: node.position.x + 200, // Position the menu 200px to the right of the node
      y: node.position.y, // Align vertically with the node
    });
    setIsMenuOpen(false); // Close the general add node menu if it's open
  }, []);

  // Handle node dragging
  const onNodeDragStop = useCallback(
    (event, node) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, position: node.position } : n
        )
      );
    },
    []
  );

  // Handle drag for the plus button
  const onPlusButtonDragStop = (event, data) => {
    setPlusButtonPosition({ x: data.x, y: data.y });
  };

  // Handle node-specific actions (like delete)
  const deleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setNodeMenuPosition(null); // Close the node menu after action
  };

  return (
    <div className="flowchart-container">
      <div className="flowchart-canvas" style={{ position: 'relative', height: '500px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onElementsRemove={onElementsRemove}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick} // Listen for node clicks
          fitView
        >
          <Controls />
          <MiniMap />
        </ReactFlow>

        {/* Plus Button inside the draggable area */}
        <div
          className="add-node-btn"
          style={{
            position: "absolute",
            left: plusButtonPosition.x,
            top: plusButtonPosition.y,
            cursor: "move",
            zIndex: 10,
            fontSize: 80,
          }}
          onDragEnd={(e) => onPlusButtonDragStop(e, { x: e.clientX - 40, y: e.clientY - 40 })}
          draggable
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu on click
        >
          +
        </div>

        {/* Stylized Menu for adding nodes (general add node menu) */}
        {isMenuOpen && (
          <div className="add-node-menu" style={{
            position: "absolute",
            top: plusButtonPosition.y + 50, // Position below the plus button
            left: plusButtonPosition.x - 30,
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
          }}>
            <button className="menu-btn" onClick={() => addNode("Cold Email")}>Add Cold Email Node</button>
            <button className="menu-btn" onClick={() => addNode("Wait/Delay")}>Add Wait/Delay Node</button>
            <button className="menu-btn" onClick={() => addNode("Lead Source")}>Add Lead Source Node</button>
          </div>
        )}

        {/* Stylized Node-Specific Menu */}
        {nodeMenuPosition && selectedNode && (
          <div className="node-menu" style={{
            position: "absolute",
            top: nodeMenuPosition.y, // Position near the selected node
            left: nodeMenuPosition.x,
            backgroundColor: "#fff",
            padding: "20px",
            width: "300px", // Fixed width for the menu
            height: "400px", // Fixed height for the menu
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 10,
          }}>
            <h3>Node Actions</h3>
            <button className="menu-btn" onClick={() => addNode("Cold Email")}>Add Cold Email Node</button>
            <button className="menu-btn" onClick={() => addNode("Wait/Delay")}>Add Wait/Delay Node</button>
            <button className="menu-btn" onClick={() => addNode("Lead Source")}>Add Lead Source Node</button>
            <hr />
            <button className="menu-btn x" onClick={() => deleteNode(selectedNode.id)}>x</button>
            {/* Additional actions can be added here */}
          </div>
        )}
      </div>

      <div className="save-btn-container">
        <button className="save-btn" onClick={handleSaveFlow}>
          Save Sequence
        </button>
      </div>
    </div>
  );
};

const App = () => (
  <ReactFlowProvider>
    <Flowchart />
  </ReactFlowProvider>
);

export default App;
