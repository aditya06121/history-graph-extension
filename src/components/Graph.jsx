import React, { useMemo } from "react";
import dagre from "dagre";
import { ReactFlow, MiniMap, Controls, Background, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Custom node styles
const nodeStyle = {
  padding: 10,
  borderRadius: 5,
  border: '1px solid #ddd',
  background: '#fff',
  width: 260,
};

const nodeWidth = 260;
const nodeHeight = 90;

function Graph({ graphData }) {
  const { nodes: graphNodes, edges: graphEdges } = graphData || { nodes: {}, edges: [] };

  const nodes = useMemo(() =>
    Object.entries(graphNodes)
      .filter(([url]) => /^https?:\/\//i.test(url))
      .map(([url, node]) => {
        const title = node.title || (() => {
          try { return new URL(url).hostname; } catch { return url; }
        })();
        const favicon = `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url)}&sz=64`;
        return ({
          id: url,
          data: {
            label: (
              <div style={{ fontSize: '12px' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '4px' }}>
                  <img src={favicon} alt="" width={16} height={16} style={{ borderRadius: 3 }} />
                  <div style={{ fontWeight: 'bold' }}>{title}</div>
                </div>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <a href={url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }} onClick={(e) => e.stopPropagation()}>
                    {url}
                  </a>
                </div>
              </div>
            ),
          },
          position: { x: 0, y: 0 },
          style: nodeStyle,
        });
      }), [graphNodes]);

  const edges = useMemo(() => {
    const nodeIds = new Set((Object.keys(graphNodes || {})).filter((u) => /^https?:\/\//i.test(u)));
    return (graphEdges || [])
      .map((edge, index) => ({
        id: `edge-${index}`,
        source: edge.sourceUrl || edge.from,
        target: edge.targetUrl || edge.to,
        animated: true,
        style: { stroke: '#999' },
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
      }))
      .filter((e) => e.source && e.target && nodeIds.has(e.source) && nodeIds.has(e.target));
  }, [graphEdges, graphNodes]);

  const layoutedNodes = useMemo(() => {
    if (!nodes.length) return [];

    // Build a fresh dagre graph each time to avoid stale nodes/edges
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: 'LR', nodesep: 50, ranksep: 80 });

    nodes.forEach(node => {
      g.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach(edge => {
      if (edge.source && edge.target) g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    return nodes.map(node => {
      const nodeWithPos = g.node(node.id) || { x: 0, y: 0 };
      return {
        ...node,
        position: {
          x: nodeWithPos.x - nodeWidth / 2,
          y: nodeWithPos.y - nodeHeight / 2,
        },
      };
    });
  }, [nodes, edges]);

  if (!graphData) {
    return <div>Loading...</div>;
  }

  return (
    <ReactFlow
      nodes={layoutedNodes}
      edges={edges}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}

export default Graph;
