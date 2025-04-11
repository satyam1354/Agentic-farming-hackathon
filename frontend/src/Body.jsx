import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Bar } from 'react-chartjs-2';
// import 'chart.js/auto';

function Body() {
    const [landSize, setLandSize] = useState('');
    const [soilType, setSoilType] = useState('');
    const [preferredCrops, setPreferredCrops] = useState('');
    const [budget, setBudget] = useState('');

    const [role, setRole] = useState('Farmer advisor');
    const [output, setOutput] = useState('');
    const [history, setHistory] = useState([]);

    const formattedPrompt = `
    You are an AI farmer advisor. Analyze this input:
    - Land: ${landSize}
    - Soil: ${soilType}
    - Preferred crops: ${preferredCrops}
    - Budget: ${budget}
    Recommend suitable crops and resource allocation.
    `;

    const askAgent = async () => {
        try {
            const res = await axios.post('http://localhost:5000/ask-agent', {
                role,
                prompt: formattedPrompt
            });
            console.log(res.data)
            setOutput(res.data.output);
            fetchHistory();
        } catch (err) {
            console.log(err?.response?.data?.message)
            alert('Error talking to agent');
        }
    };

    const fetchHistory = async () => {
        const res = await axios.get('http://localhost:5000/history');
        setHistory(res.data);
    };

    //   const handleSoilUpload = async () => {
    //     const formData = new FormData();
    //     formData.append('soilData', soilFile);
    //     await axios.post('http://localhost:5000/upload-soil', formData);
    //     alert('Soil data uploaded');
    //   };

    useEffect(() => {
        fetchHistory();
    }, []);

    const cropData = {
        labels: ['Wheat', 'Corn', 'Rice', 'Soybean'],
        datasets: [
            {
                label: 'Profitability Index',
                data: [8, 6, 7, 5],
                backgroundColor: ['#4ade80', '#60a5fa', '#facc15', '#f87171']
            }
        ]
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">🌱 Agentic Farming Assistant</h1>

            <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 border rounded mb-2">
                <option value="advisor">Farmer Advisor</option>
                <option value="market">Market Researcher</option>
                <option value="weather">Weather Advisor</option>
            </select>

            {/* <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Ask something..."
            /> */}
            <div className="grid grid-cols-1 gap-2 mb-4">
                <input
                    type="text"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    placeholder="Land size (e.g., 5 acres)"
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    placeholder="Soil type (e.g., Loamy)"
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    value={preferredCrops}
                    onChange={(e) => setPreferredCrops(e.target.value)}
                    placeholder="Preferred crops (e.g., Wheat, Corn)"
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Budget (e.g., ₹50,000)"
                    className="p-2 border rounded"
                />
            </div>

            <button onClick={askAgent} className="mt-2 px-4 py-2 bg-green-600 text-white rounded cursor-pointer">Ask Agent</button>

            {/* <div className="mt-4">
        <input type="file" onChange={(e) => setSoilFile(e.target.files[0])} />
        <button
          onClick={handleSoilUpload}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
        >Upload Soil Data</button>
      </div> */}

            <div className="mt-6">
                <h2 className="text-lg font-semibold">🧠 Agent Response</h2>
                <p className="mt-2 border p-2 rounded bg-gray-100">{output}</p>
            </div>

            {/* <div className="mt-6">
        <h2 className="text-lg font-semibold">📊 Crop Suggestions</h2>
        <Bar data={cropData} />
      </div> */}

            <div className="mt-6">
                <h2 className="text-lg font-semibold">📜 Recent Logs</h2>
                <ul className="mt-2">
                    {history.map(log => (
                        <li key={log.id} className="mb-2 p-2 border rounded bg-white">
                            <strong>{log.role}:</strong> {log.input}<br />
                            <em>→ {log.output}</em>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Body;
