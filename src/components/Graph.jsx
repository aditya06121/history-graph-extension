import React, { useMemo } from "react";
import dagre from "dagre";
import { ReactFlow, MiniMap, Controls, Background, MarkerType, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Utility: color by domain
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
function domainColors(url) {
  try {
    const host = new URL(url).hostname;
    const hue = hashString(host) % 360;
    return {
      border: `hsl(${hue} 70% 45%)`,
      bg: `hsl(${hue} 85% 97%)`,
      text: `hsl(${hue} 70% 35%)`,
    };
  } catch {
    return { border: '#64748b', bg: '#f8fafc', text: '#334155' };
  }
}

// Base node styles
const nodeBaseStyle = {
  padding: 10,
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  background: '#fff',
  width: 280,
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
};

const nodeWidth = 280;
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
        const colors = domainColors(url);
        return ({
          id: url,
          data: {
            label: (
              <div style={{ fontSize: '12px' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '4px' }}>
                  <img src={favicon} alt="" width={16} height={16} style={{ borderRadius: 3 }} />
                  <div style={{ fontWeight: 'bold', color: colors.text }}>{title}</div>
                </div>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <a href={url} target="_blank" rel="noreferrer" style={{ color: colors.text, textDecoration: 'underline' }} onClick={(e) => e.stopPropagation()}>
                    {url}
                  </a>
                </div>
              </div>
            ),
          },
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: { ...nodeBaseStyle, borderLeft: `6px solid ${colors.border}`, background: colors.bg },
        });
      }), [graphNodes]);

  const edges = useMemo(() => {
    const nodeIds = new Set((Object.keys(graphNodes || {})).filter((u) => /^https?:\/\//i.test(u)));
    const colorForType = (t) => {
      switch (t) {
        case 'typed': return '#16a34a';
        case 'link': return '#2563eb';
        case 'reload': return '#6b7280';
        case 'history': return '#a855f7';
        default: return '#f59e0b';
      }
    };
    return (graphEdges || [])
      .map((edge, index) => {
        const source = edge.sourceUrl || edge.from;
        const target = edge.targetUrl || edge.to;
        const color = colorForType(edge.type);
        return {
          id: `edge-${index}`,
          source,
          target,
          animated: true,
          style: { stroke: color, strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color },
          type: 'smoothstep',
        };
      })
      .filter((e) => e.source && e.target && nodeIds.has(e.source) && nodeIds.has(e.target));
  }, [graphEdges, graphNodes]);

  const layoutedNodes = useMemo(() => {
    if (!nodes.length) return [];

    // Build a fresh dagre graph each time to avoid stale nodes/edges
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 100 });

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
