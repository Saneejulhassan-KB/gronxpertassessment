import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  ConnectionMode,
  Handle
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const nodeTypes = {
  input: ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-blue-100 border-2 border-blue-400">
      <Handle type="source" position="right" />
      <div className="text-lg font-bold">{data.label}</div>
    </div>
  ),
  process: ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-yellow-100 border-2 border-yellow-400">
      <Handle type="target" position="left" />
      <Handle type="source" position="right" />
      <div className="text-lg font-bold">{data.label}</div>
    </div>
  ),
  output: ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-green-100 border-2 border-green-400">
      <Handle type="target" position="left" />
      <div className="text-lg font-bold">{data.label}</div>
    </div>
  ),
};

const FlowchartEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowchartName, setFlowchartName] = useState('');
  const [flowcharts, setFlowcharts] = useState([]);
  const [selectedFlowchart, setSelectedFlowchart] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const fetchFlowcharts = async () => {
    try {
      const response = await axios.get('/flowchart');
      setFlowcharts(response.data);
    } catch (error) {
      console.error('Error fetching flowcharts:', error);
      if (error.response?.status === 401) {
        navigate('/auth');
      } else {
        setError('Failed to fetch flowcharts');
      }
    }
  };

  const saveFlowchart = async () => {
    try {
      if (!flowchartName) {
        setError('Please enter a flowchart name');
        return;
      }

      if (selectedFlowchart) {
        await axios.put(`/flowchart/${selectedFlowchart._id}`, {
          name: flowchartName,
          nodes,
          edges
        });
      } else {
        await axios.post('/flowchart', {
          name: flowchartName,
          nodes,
          edges
        });
      }
      setError('');
      fetchFlowcharts();
    } catch (error) {
      console.error('Error saving flowchart:', error);
      if (error.response?.status === 401) {
        navigate('/auth');
      } else {
        setError('Failed to save flowchart');
      }
    }
  };

  const loadFlowchart = async (id) => {
    try {
      const response = await axios.get(`/flowchart/${id}`);
      setNodes(response.data.nodes);
      setEdges(response.data.edges);
      setFlowchartName(response.data.name);
      setSelectedFlowchart(response.data);
      setError('');
    } catch (error) {
      console.error('Error loading flowchart:', error);
      if (error.response?.status === 401) {
        navigate('/auth');
      } else {
        setError('Failed to load flowchart');
      }
    }
  };

  const deleteFlowchart = async (id) => {
    try {
      await axios.delete(`/flowchart/${id}`);
      if (selectedFlowchart?._id === id) {
        createNewFlowchart();
      }
      fetchFlowcharts();
    } catch (error) {
      console.error('Error deleting flowchart:', error);
      if (error.response?.status === 401) {
        navigate('/auth');
      } else {
        setError('Failed to delete flowchart');
      }
    }
  };

  const createNewFlowchart = () => {
    setNodes([]);
    setEdges([]);
    setFlowchartName('');
    setSelectedFlowchart(null);
    setError('');
  };

  useEffect(() => {
    fetchFlowcharts();
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-left" className="bg-white/90 p-6 rounded-2xl shadow-xl border border-blue-100 space-y-4 mt-4 ml-4">
          <div className="space-y-4">
            <input
              type="text"
              value={flowchartName}
              onChange={(e) => setFlowchartName(e.target.value)}
              placeholder="Flowchart name"
              className="border border-blue-200 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-blue-300 bg-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={saveFlowchart}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={createNewFlowchart}
                className="bg-gradient-to-r from-gray-400 to-gray-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-gray-500 hover:to-gray-700 transition"
              >
                New
              </button>
            </div>
            <select
              onChange={(e) => loadFlowchart(e.target.value)}
              className="border border-blue-200 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
              value={selectedFlowchart?._id || ''}
            >
              <option value="">Select a flowchart</option>
              {flowcharts.map((flowchart) => (
                <option key={flowchart._id} value={flowchart._id}>
                  {flowchart.name}
                </option>
              ))}
            </select>
            {selectedFlowchart && (
              <button
                onClick={() => deleteFlowchart(selectedFlowchart._id)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg w-full font-semibold shadow hover:from-red-600 hover:to-red-700 transition"
              >
                Delete
              </button>
            )}
          </div>
        </Panel>
        <Panel position="top-right" className="bg-white/90 p-6 rounded-2xl shadow-xl border border-green-100 mt-4 mr-4">
          <div className="space-y-3">
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'input')}
              className="px-4 py-2 bg-blue-100 border-2 border-blue-400 rounded-lg cursor-move hover:bg-blue-200 font-semibold text-blue-700 shadow"
            >
              Input Node
            </div>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'process')}
              className="px-4 py-2 bg-yellow-100 border-2 border-yellow-400 rounded-lg cursor-move hover:bg-yellow-200 font-semibold text-yellow-700 shadow"
            >
              Process Node
            </div>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'output')}
              className="px-4 py-2 bg-green-100 border-2 border-green-400 rounded-lg cursor-move hover:bg-green-200 font-semibold text-green-700 shadow"
            >
              Output Node
            </div>
          </div>
        </Panel>
      </ReactFlow>
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-xl text-lg animate-bounce">
          {error}
        </div>
      )}
    </div>
  );
};

export default FlowchartEditor; 