import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
const baseURL = process.env.REACT_APP_BACKEND_URL;


function Body() {
    const [role, setRole] = useState('Farmer advisor');
    const [season, setSeason] = useState('Spring Season');
    const [landSize, setLandSize] = useState('');
    const [soilType, setSoilType] = useState('');
    const [preferredCrops, setPreferredCrops] = useState('');
    const [budget, setBudget] = useState('');
    const [prompt, setPrompt] = useState('');

    const [output, setOutput] = useState('');
    const [history, setHistory] = useState([]);

    const formattedPrompt = `
    You are an AI farmer advisor. Analyze this input:
    - Season: ${season}
    - Land: ${landSize}
    - Soil: ${soilType}
    - Preferred crops: ${preferredCrops}
    - Budget: ${budget}
    - and prompt is : ${prompt}
    Recommend suitable crops and resource allocation.
    `;

    const askAgent = async () => {
        try {
            const res = await axios.post(`${baseURL}/ask-agent`, {
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

    function AgentResponse({ output }) {
        return (
            <div className="mt-4 p-4 bg-gray-100 rounded shadow border">
                <h2 className="text-2xl font-bold mb-4">Agent Response</h2>
                <div className="w-full max-w-none">
                    <div className="prose max-w-full prose-headings:font-bold prose-li:marker:text-green-600 ">
                        <ReactMarkdown>{output}</ReactMarkdown>
                    </div>
                </div>
            </div >
        );
    }

    const fetchHistory = async () => { `${baseURL}/history`
        const res = await axios.get(`${baseURL}/history`);
        setHistory(res.data);
    };

    const RenderedResponse = ({ response }) => {
        if (!Array.isArray(response)) {
            return <div>No valid response</div>;
        }
        return (
            <div className="space-y-8">
                {response.slice(0, 3).map((entry, index) => (
                    <div key={index} className="  w-full max-w-none  bg-gray-100 p-4 rounded shadow">
                        <ReactMarkdown>{entry.output}</ReactMarkdown>
                    </div>
                ))}
            </div>
        );
    };

    useEffect(() => {
        fetchHistory();
    }, []);


    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4"> Agentic Farming Assistant</h1>

            <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 border rounded mb-2">
                <option value="advisor">Farmer Advisor</option>
                <option value="market">Market Researcher</option>
                <option value="weather">Weather Advisor</option>
            </select>

            <select value={season} onChange={(e) => setSeason(e.target.value)} className=" mx-4 p-2 border rounded mb-2">
                <option value="Spring Season">Spring Season</option>
                <option value="Summer Season">Summer Season</option>
                <option value="Rainy Season">Rainy Season</option>
                <option value="Winter Season">Winter Season</option>
            </select>

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
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Add specific details to Agent..."
            />

            <button onClick={askAgent} className="mt-2 px-4 py-2 bg-green-600 text-white rounded cursor-pointer">Ask Agent</button>


            <div>
                {output && <AgentResponse output={output} />}
            </div>


            <div className="mt-6">
                <h2 className="text-2xl font-semibold"> Recent Logs</h2>
                <ul className="mt-2">
                    {history.length > 0 && <RenderedResponse response={history} />}
                </ul>
            </div>

        </div>
    );
}

export default Body;
