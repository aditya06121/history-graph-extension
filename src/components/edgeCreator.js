export default function edgeCreator(logs) {
  if (!logs || logs.length === 0) return;

  const nodeMap = {};

  for (let i = 0; i < logs.length; i++) {
    const key = `node${i}`;
    const currentLog = logs[i];

    nodeMap[key] = {
      title: currentLog.title,
      url: currentLog.url,
      parent: null, // default to null
    };

    for (let j = 0; j < logs.length; j++) {
      if (logs[j].tabId === currentLog.openerTabId) {
        nodeMap[key].parent = currentLog.openerTabId;
        break;
      }
    }
  }

  return nodeMap;
}
