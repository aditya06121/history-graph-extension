import React from "react";
import dagre from "dagre";
import { ReactFlow, MiniMap, Controls, Background } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

//dagre setup
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 200;
const nodeHeight = 50;

// Layout function
const getLayoutedElements = (nodes, edges, direction = "LR") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);
  nodes.forEach((node) => {
    const { x, y } = dagreGraph.node(node.id);
    node.position = {
      x: x - nodeWidth / 2,
      y: y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

function Graph({ logs }) {
  if (!logs) {
    return <p className="text-lg font-medium">Loading logs...</p>;
  }
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
        <svg
          className="w-12 h-12 mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75zm-6.364 6.364a9 9 0 1112.728-12.728 9 9 0 01-12.728 12.728z"
          />
        </svg>
        <p className="text-lg font-medium">No logs found</p>
      </div>
    );
  }
  console.log(logs);
  return (
    <div style={{ width: "100vw", height: "85vh" }}>
      {/* <ReactFlow nodes={nodes} edges={edges} fitView>
        <Controls orientation="horizontal" showInteractive={false} />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow> */}
    </div>
  );
}

export default Graph;
