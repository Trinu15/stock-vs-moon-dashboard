import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Generate mock stock data for comparison
const generateMockStockData = (ticker, days = 30) => {
  const data = [];
  const basePrice = ticker.length * 25 + 100;
  let currentPrice = basePrice;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const change = (Math.random() - 0.48) * 0.06;
    currentPrice = currentPrice * (1 + change);
    
    data.push({
      date: dateStr,
      close: currentPrice,
      moonPhase: { name: 'waxing-crescent', fraction: Math.random() }
    });
  }
  
  return { ticker, data };
};

const MultiStockComparison = ({ stocks, onStocksChange, period, onPeriodChange }) => {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newStock, setNewStock] = useState('');

  const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

  const fetchComparisonData = async () => {
    if (stocks.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      const periodDays = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365, '5Y': 1825 };
      const days = periodDays[period] || 30;
      
      const allData = stocks.map(stock => generateMockStockData(stock, Math.min(days, 100)));
      
      // Merge data by date
      const dateMap = new Map();
      
      allData.forEach((stockData) => {
        const ticker = stockData.ticker;
        stockData.data.forEach(item => {
          if (!dateMap.has(item.date)) {
            dateMap.set(item.date, { date: item.date });
          }
          dateMap.get(item.date)[ticker] = item.close;
          dateMap.get(item.date)[`${ticker}_moonPhase`] = item.moonPhase;
        });
      });
      
      const mergedData = Array.from(dateMap.values())
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setComparisonData({
        stocks,
        data: mergedData,
        colors: colors.slice(0, stocks.length)
      });
      
    } catch (err) {
      setError('Failed to generate comparison data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparisonData();
  }, [stocks, period]);

  const addStock = () => {
    if (newStock.trim() && !stocks.includes(newStock.toUpperCase()) && stocks.length < 5) {
      onStocksChange([...stocks, newStock.toUpperCase()]);
      setNewStock('');
    }
  };

  const removeStock = (stockToRemove) => {
    onStocksChange(stocks.filter(stock => stock !== stockToRemove));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'white',
          padding: '15px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <p><strong>Date:</strong> {new Date(label).toLocaleDateString()}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              <strong>{entry.dataKey}:</strong> ${entry.value?.toFixed(2)}
            </p>
          ))}
          {data[`${stocks[0]}_moonPhase`] && (
            <p><strong>Moon Phase:</strong> {data[`${stocks[0]}_moonPhase`].name}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="multi-stock-comparison">
      <div className="comparison-controls">
        <div className="stock-manager">
          <h3>📊 Stock Comparison</h3>
          <div className="add-stock">
            <input
              type="text"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value.toUpperCase())}
              placeholder="Add stock (e.g., GOOGL)"
              maxLength={10}
              onKeyPress={(e) => e.key === 'Enter' && addStock()}
            />
            <button 
              onClick={addStock}
              disabled={!newStock.trim() || stocks.includes(newStock.toUpperCase()) || stocks.length >= 5}
              className="add-btn"
            >
              + Add
            </button>
          </div>
          
          <div className="stock-list">
            {stocks.map((stock, index) => (
              <div key={stock} className="stock-chip" style={{ borderColor: colors[index] }}>
                <span style={{ color: colors[index] }}>●</span>
                {stock}
                {stocks.length > 1 && (
                  <button onClick={() => removeStock(stock)} className="remove-stock">×</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="period-selector">
          <label>Time Period:</label>
          <div className="period-buttons">
            {['1M', '3M', '6M', '1Y', '5Y'].map((p) => (
              <button
                key={p}
                className={`period-btn ${period === p ? 'active' : ''}`}
                onClick={() => onPeriodChange(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading comparison data...</p>
        </div>
      )}

      {comparisonData && (
        <div className="comparison-chart-container">
          <h3>Stock Price Comparison ({period})</h3>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={comparisonData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {stocks.map((stock, index) => (
                <Line
                  key={stock}
                  type="monotone"
                  dataKey={stock}
                  stroke={colors[index]}
                  strokeWidth={2}
                  dot={false}
                  name={stock}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          
          <div className="comparison-insights">
            <h4>📈 Quick Insights</h4>
            <div className="insight-grid">
              {stocks.map((stock, index) => {
                const stockData = comparisonData.data.filter(d => d[stock]).map(d => d[stock]);
                const firstPrice = stockData[0];
                const lastPrice = stockData[stockData.length - 1];
                const return_ = ((lastPrice - firstPrice) / firstPrice) * 100;
                
                return (
                  <div key={stock} className="comparison-insight">
                    <div className="stock-return" style={{ color: colors[index] }}>
                      <strong>{stock}</strong>
                      <span className={return_ >= 0 ? 'positive' : 'negative'}>
                        {return_ >= 0 ? '+' : ''}{return_.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStockComparison;