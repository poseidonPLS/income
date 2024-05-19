import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [validator, setValidator] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!validator) {
      setError('Please enter a validator index or pubkey');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://beacon.pulsechain.com/api/v1/validator/${validator}/balancehistory?limit=10`
      );
      setData(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderIncome = (current, previous) => {
    const diff = previous.balance - current.balance;
    return (diff / 1e9).toFixed(2);
  };

  return (
    <div className="App">
      <h1>PulseChain Validator Balance and Income</h1>
      <p className="disclaimer">
        The accuracy of this information relies on the indexing of the beacon explorer. No responsibility is taken for any inaccuracies. Please note that positive values indicate income, while a single negative value (shown in red) represent a withdrawal to the wallet.
      </p>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Validator Index or Pubkey"
          value={validator}
          onChange={(e) => setValidator(e.target.value)}
        />
        <button onClick={fetchData}>Fetch Data</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <table>
        <thead>
          <tr>
            <th>Epoch</th>
            <th>Balance (PLS)</th>
            <th>Income (PLS)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={entry.epoch}>
              <td>{entry.epoch}</td>
              <td>{(entry.balance / 1e9).toFixed(2)}</td>
              <td style={{ color: index > 0 && data[index - 1].balance - entry.balance >= 0 ? 'green' : 'red' }}>
                {index > 0
                  ? Math.abs(renderIncome(entry, data[index - 1]))
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
