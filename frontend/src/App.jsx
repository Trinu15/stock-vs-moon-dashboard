import React, { useState } from 'react';
import StockChart from './components/StockChart';
import InsightsPanel from './components/InsightsPanel';
import BacktestPanel from './components/BacktestPanel';
import MethodologyModal from './components/MethodologyModal';
import MultiStockComparison from './components/MultiStockComparison';
import axios from 'axios';

function App() {
  const [ticker, setTicker] = useState('AAPL');
  const [period, setPeriod] = useState('1M');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [backtestResults, setBacktestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [activeTab, setActiveTab] = useState('single'); // 'single' or 'compare'
  const [compareStocks, setCompareStocks] = useState(['AAPL', 'TSLA']);

  const fetchData = async () => {
    if (!ticker.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let periodParam = period;
      if (period === 'CUSTOM' && customStartDate && customEndDate) {
        periodParam = `${period}&startDate=${customStartDate}&endDate=${customEndDate}`;
      }
      
      const [stockResponse, insightsResponse, backtestResponse] = await Promise.all([
        axios.get(`/api/stock/${ticker}?period=${periodParam}`),
        axios.get(`/api/stock/${ticker}/insights?period=${periodParam}`),
        axios.get(`/api/stock/${ticker}/backtest?period=${periodParam}`)
      ]);
      
      setData(stockResponse.data);
      setInsights(insightsResponse.data);
      setBacktestResults(backtestResponse.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch data';
      setError(errorMsg);
      
      // Clear data on error
      setData(null);
      setInsights(null);
      setBacktestResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🌙 Stock vs Moon Dashboard</h1>
        <p>Advanced lunar cycle analysis for financial markets</p>
        <div className="header-actions">
          <button 
            className="methodology-btn"
            onClick={() => setShowMethodology(true)}
          >
            📖 How It Works
          </button>
        </div>
      </header>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
          onClick={() => setActiveTab('single')}
        >
          Single Stock Analysis
        </button>
        <button 
          className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          Multi-Stock Comparison
        </button>
      </div>

      {activeTab === 'single' ? (
        <>
          <form onSubmit={handleSubmit} className="controls">
            <div className="input-group">
              <label>Stock Ticker</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="e.g., AAPL, TSLA, GOOGL"
                maxLength={10}
              />
            </div>

            <div className="input-group">
              <label>Time Period</label>
              <div className="period-buttons">
                {['1M', '3M', '6M', '1Y', '5Y', 'CUSTOM'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`period-btn ${period === p ? 'active' : ''}`}
                    onClick={() => setPeriod(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {period === 'CUSTOM' && (
              <div className="custom-date-range">
                <div className="input-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="fetch-btn"
              disabled={loading || !ticker.trim() || (period === 'CUSTOM' && (!customStartDate || !customEndDate))}
            >
              {loading ? 'Analyzing...' : '🚀 Analyze'}
            </button>
          </form>

          {error && (
            <div className="error">
              <strong>Error:</strong> {error}
              {error.includes('Invalid') && (
                <p>Please check the stock ticker symbol and try again.</p>
              )}
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Fetching stock data and calculating lunar correlations...</p>
            </div>
          )}

          {data && (
            <>
              {data.mockData && (
                <div className="demo-notice">
                  <p>
                    📊 <strong>Demo Mode:</strong> Using simulated data. 
                    Get a free API key from <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer">AlphaVantage</a> for real stock data.
                  </p>
                </div>
              )}
              <div className="dashboard-grid">
                <div className="chart-section">
                  <StockChart data={data} />
                </div>
                
                <div className="insights-section">
                  {insights && <InsightsPanel insights={insights} />}
                  {backtestResults && <BacktestPanel results={backtestResults} />}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <MultiStockComparison 
          stocks={compareStocks}
          onStocksChange={setCompareStocks}
          period={period}
          onPeriodChange={setPeriod}
        />
      )}

      {showMethodology && (
        <MethodologyModal onClose={() => setShowMethodology(false)} />
      )}
    </div>
  );
}

export default App;