import { useState } from 'react';
import StockChart from './components/StockChart';
import InsightsPanel from './components/InsightsPanel';
import BacktestPanel from './components/BacktestPanel';
import MethodologyModal from './components/MethodologyModal';
import MultiStockComparison from './components/MultiStockComparison';

// Moon phase calculation (simplified SunCalc logic)
const getMoonPhase = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const c = Math.floor(year / 100);
  const n = year - 19 * Math.floor(year / 19);
  const k = Math.floor((c - 17) / 25);
  let i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
  i = i - 30 * Math.floor(i / 30);
  i = i - Math.floor(i / 28) * (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
  let j = year + Math.floor(year / 4) + i + 2 - c + Math.floor(c / 4);
  j = j - 7 * Math.floor(j / 7);
  const l = i - j;
  const moonDay = day + l;
  const phase = ((moonDay % 30) / 30);
  
  let phaseName = 'waning-crescent';
  let fraction = Math.abs(Math.sin(phase * Math.PI * 2)) * 0.5 + 0.5;
  
  if (phase < 0.125) { phaseName = 'new'; fraction = phase * 4; }
  else if (phase < 0.25) { phaseName = 'waxing-crescent'; fraction = 0.25 + (phase - 0.125) * 4; }
  else if (phase < 0.375) { phaseName = 'first-quarter'; fraction = 0.5 + (phase - 0.25) * 2; }
  else if (phase < 0.5) { phaseName = 'waxing-gibbous'; fraction = 0.75 + (phase - 0.375) * 2; }
  else if (phase < 0.625) { phaseName = 'full'; fraction = 1 - (phase - 0.5) * 2; }
  else if (phase < 0.75) { phaseName = 'waning-gibbous'; fraction = 0.75 - (phase - 0.625) * 2; }
  else if (phase < 0.875) { phaseName = 'last-quarter'; fraction = 0.5 - (phase - 0.75) * 2; }
  else { phaseName = 'waning-crescent'; fraction = 0.25 - (phase - 0.875) * 2; }
  
  return { phase, fraction: Math.max(0, Math.min(1, fraction)), name: phaseName };
};

// Generate mock stock data
const generateMockStockData = (ticker, days = 30) => {
  const data = [];
  const basePrice = ticker.length * 25 + 100; // Different base price per ticker
  let currentPrice = basePrice;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Random price movement with trend
    const change = (Math.random() - 0.48) * 0.06;
    currentPrice = currentPrice * (1 + change);
    
    const moonPhase = getMoonPhase(date);
    
    data.push({
      date: dateStr,
      open: currentPrice * (1 + (Math.random() - 0.5) * 0.02),
      high: currentPrice * (1 + Math.random() * 0.03),
      low: currentPrice * (1 - Math.random() * 0.03),
      close: currentPrice,
      volume: Math.floor(Math.random() * 10000000 + 1000000),
      moonPhase
    });
  }
  
  return data;
};

// Generate mock insights
const generateMockInsights = (ticker, stockData) => {
  const fullMoonDays = stockData.filter(d => d.moonPhase.name === 'full');
  const newMoonDays = stockData.filter(d => d.moonPhase.name === 'new');
  
  return {
    ticker: ticker.toUpperCase(),
    insights: {
      fullMoonAvgReturn: (Math.random() - 0.4) * 3,
      newMoonAvgReturn: (Math.random() - 0.5) * 2.5,
      volatilityNearTransitions: Math.random() * 2 + 0.5,
      totalDaysAnalyzed: stockData.length,
      fullMoonDays: fullMoonDays.length,
      newMoonDays: newMoonDays.length
    }
  };
};

// Generate mock backtest results
const generateMockBacktest = (ticker) => {
  const baseReturn = (Math.random() - 0.3) * 0.3;
  
  return {
    ticker: ticker.toUpperCase(),
    strategies: {
      moonSwing: {
        totalReturn: baseReturn + (Math.random() - 0.5) * 0.2,
        annualizedReturn: (baseReturn + (Math.random() - 0.5) * 0.2) * 0.8,
        maxDrawdown: -(Math.random() * 0.15 + 0.05),
        winRate: Math.random() * 0.4 + 0.4,
        totalTrades: Math.floor(Math.random() * 20 + 10),
        sharpeRatio: (Math.random() - 0.3) * 2
      },
      inverseMoon: {
        totalReturn: baseReturn * -0.5 + (Math.random() - 0.5) * 0.15,
        annualizedReturn: (baseReturn * -0.5 + (Math.random() - 0.5) * 0.15) * 0.8,
        maxDrawdown: -(Math.random() * 0.2 + 0.08),
        winRate: Math.random() * 0.3 + 0.3,
        totalTrades: Math.floor(Math.random() * 20 + 10),
        sharpeRatio: (Math.random() - 0.6) * 1.5
      },
      buyHold: {
        totalReturn: baseReturn * 0.7,
        annualizedReturn: baseReturn * 0.7 * 0.9,
        maxDrawdown: -(Math.random() * 0.25 + 0.1),
        winRate: 1.0,
        totalTrades: 1,
        sharpeRatio: Math.random() * 1.5 + 0.3
      }
    }
  };
};

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
  const [activeTab, setActiveTab] = useState('single');
  const [compareStocks, setCompareStocks] = useState(['AAPL', 'TSLA']);

  const fetchData = async () => {
    if (!ticker.trim()) return;
    
    setLoading(true);
    setError(null);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const periodDays = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365, '5Y': 1825 };
      const days = periodDays[period] || 30;
      
      const stockData = generateMockStockData(ticker, Math.min(days, 100));
      
      setData({
        ticker: ticker.toUpperCase(),
        period,
        data: stockData,
        mockData: true
      });
      
      setInsights(generateMockInsights(ticker, stockData));
      setBacktestResults(generateMockBacktest(ticker));
      
    } catch (err) {
      setError('Failed to generate data');
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
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Calculating lunar correlations for {ticker}...</p>
            </div>
          )}

          {data && (
            <>
              <div className="demo-notice">
                <p>
                  📊 <strong>Demo Mode:</strong> Showing simulated data with real moon phase calculations.
                </p>
              </div>
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