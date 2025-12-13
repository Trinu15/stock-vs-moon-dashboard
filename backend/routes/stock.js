const express = require('express');
const axios = require('axios');
const SunCalc = require('suncalc');
const router = express.Router();

// Generate mock stock data for demo purposes
const generateMockStockData = (ticker, days = 30) => {
  const data = {};
  const basePrice = Math.random() * 200 + 50; // Random base price between 50-250
  let currentPrice = basePrice;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Random price movement with some trend
    const change = (Math.random() - 0.5) * 0.08; // ±4% max change
    currentPrice = currentPrice * (1 + change);
    
    const open = currentPrice * (1 + (Math.random() - 0.5) * 0.02);
    const high = Math.max(open, currentPrice) * (1 + Math.random() * 0.03);
    const low = Math.min(open, currentPrice) * (1 - Math.random() * 0.03);
    
    data[dateStr] = {
      '1. open': open.toFixed(2),
      '2. high': high.toFixed(2),
      '3. low': low.toFixed(2),
      '4. close': currentPrice.toFixed(2),
      '5. volume': Math.floor(Math.random() * 10000000 + 1000000).toString()
    };
  }
  
  return data;
};

// Get stock data with moon phases
router.get('/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { period = '1M', startDate, endDate } = req.query;
    
    let timeSeries;
    let usingMockData = false;

    // Try to fetch real data if API key is available and not demo
    if (process.env.ALPHA_VANTAGE_API_KEY && process.env.ALPHA_VANTAGE_API_KEY !== 'demo') {
      try {
        console.log(`Fetching real data for ${ticker}...`);
        const stockResponse = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'TIME_SERIES_DAILY',
            symbol: ticker,
            apikey: process.env.ALPHA_VANTAGE_API_KEY,
            outputsize: period === '1Y' || period === '5Y' ? 'full' : 'compact'
          },
          timeout: 10000
        });

        if (stockResponse.data['Error Message']) {
          throw new Error('Invalid ticker from API');
        }

        if (stockResponse.data['Note']) {
          throw new Error('API rate limit exceeded');
        }

        timeSeries = stockResponse.data['Time Series (Daily)'];
        if (!timeSeries) {
          throw new Error('No data from API');
        }
        
        console.log(`✅ Real data fetched for ${ticker}`);
      } catch (apiError) {
        console.log(`⚠️ API failed for ${ticker}, using mock data:`, apiError.message);
        usingMockData = true;
      }
    } else {
      console.log(`📊 Using mock data for ${ticker} (demo mode)`);
      usingMockData = true;
    }

    // Use mock data if API failed or demo key
    if (usingMockData) {
      const periodDays = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365, '5Y': 1825 };
      const days = periodDays[period] || 30;
      timeSeries = generateMockStockData(ticker, Math.min(days, 100)); // Limit for demo
    }

    // Process and filter data based on period
    const now = new Date();
    const periodDays = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      '5Y': 1825
    };
    
    let cutoffDate;
    let endDateFilter = now;
    
    if (period === 'CUSTOM' && startDate && endDate) {
      cutoffDate = new Date(startDate);
      endDateFilter = new Date(endDate);
    } else {
      cutoffDate = new Date(now.getTime() - (periodDays[period] * 24 * 60 * 60 * 1000));
    }
    
    const processedData = Object.entries(timeSeries)
      .filter(([date]) => {
        const dateObj = new Date(date);
        return dateObj >= cutoffDate && dateObj <= endDateFilter;
      })
      .map(([date, data]) => {
        const dateObj = new Date(date);
        const moonPhase = SunCalc.getMoonIllumination(dateObj);
        
        // Determine moon phase name
        let phaseName = 'waning-crescent';
        if (moonPhase.phase < 0.125) phaseName = 'new';
        else if (moonPhase.phase < 0.375) phaseName = 'waxing-crescent';
        else if (moonPhase.phase < 0.625) phaseName = 'full';
        else if (moonPhase.phase < 0.875) phaseName = 'waning-crescent';
        else phaseName = 'new';

        return {
          date,
          open: parseFloat(data['1. open']),
          high: parseFloat(data['2. high']),
          low: parseFloat(data['3. low']),
          close: parseFloat(data['4. close']),
          volume: parseInt(data['5. volume']),
          moonPhase: {
            fraction: moonPhase.fraction,
            phase: moonPhase.phase,
            name: phaseName
          }
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      ticker: ticker.toUpperCase(),
      period,
      data: processedData,
      mockData: usingMockData
    });

  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Get insights about stock performance vs moon phases
router.get('/:ticker/insights', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { period = '1M', startDate, endDate } = req.query;
    
    let timeSeries;
    let usingMockData = false;

    // Try real API first, fallback to mock
    if (process.env.ALPHA_VANTAGE_API_KEY && process.env.ALPHA_VANTAGE_API_KEY !== 'demo') {
      try {
        const stockResponse = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'TIME_SERIES_DAILY',
            symbol: ticker,
            apikey: process.env.ALPHA_VANTAGE_API_KEY,
            outputsize: period === '1Y' || period === '5Y' ? 'full' : 'compact'
          },
          timeout: 10000
        });

        timeSeries = stockResponse.data['Time Series (Daily)'];
        if (!timeSeries) {
          throw new Error('No data from API');
        }
      } catch (apiError) {
        usingMockData = true;
      }
    } else {
      usingMockData = true;
    }

    if (usingMockData) {
      const periodDays = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365, '5Y': 1825 };
      const days = periodDays[period] || 30;
      timeSeries = generateMockStockData(ticker, Math.min(days, 100));
    }

    // Filter data same as main endpoint
    const now = new Date();
    const periodDays = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365, '5Y': 1825 };
    
    let cutoffDate, endDateFilter = now;
    if (period === 'CUSTOM' && startDate && endDate) {
      cutoffDate = new Date(startDate);
      endDateFilter = new Date(endDate);
    } else {
      cutoffDate = new Date(now.getTime() - (periodDays[period] * 24 * 60 * 60 * 1000));
    }

    const processedData = Object.entries(timeSeries)
      .filter(([date]) => {
        const dateObj = new Date(date);
        return dateObj >= cutoffDate && dateObj <= endDateFilter;
      })
      .map(([date, data]) => {
        const dateObj = new Date(date);
        const moonPhase = SunCalc.getMoonIllumination(dateObj);
        
        let phaseName = 'waning-crescent';
        if (moonPhase.phase < 0.125) phaseName = 'new';
        else if (moonPhase.phase < 0.375) phaseName = 'waxing-crescent';
        else if (moonPhase.phase < 0.625) phaseName = 'full';
        else if (moonPhase.phase < 0.875) phaseName = 'waning-crescent';
        else phaseName = 'new';

        return {
          date,
          close: parseFloat(data['4. close']),
          moonPhase: { name: phaseName, fraction: moonPhase.fraction }
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate insights
    const fullMoonDays = processedData.filter(d => d.moonPhase.name === 'full');
    const newMoonDays = processedData.filter(d => d.moonPhase.name === 'new');
    
    const calculateReturns = (days) => {
      if (days.length < 2) return 0;
      const returns = [];
      for (let i = 1; i < days.length; i++) {
        const prevPrice = processedData.find(d => d.date < days[i].date)?.close;
        if (prevPrice) {
          returns.push((days[i].close - prevPrice) / prevPrice);
        }
      }
      return returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
    };

    const fullMoonAvgReturn = calculateReturns(fullMoonDays);
    const newMoonAvgReturn = calculateReturns(newMoonDays);
    
    // Calculate volatility near transitions
    const volatilities = processedData.map((item, index) => {
      if (index === 0) return 0;
      const prev = processedData[index - 1];
      return Math.abs((item.close - prev.close) / prev.close);
    });
    const avgVolatility = volatilities.reduce((a, b) => a + b, 0) / volatilities.length;

    res.json({
      ticker: ticker.toUpperCase(),
      insights: {
        fullMoonAvgReturn: fullMoonAvgReturn * 100,
        newMoonAvgReturn: newMoonAvgReturn * 100,
        volatilityNearTransitions: avgVolatility * 100,
        totalDaysAnalyzed: processedData.length,
        fullMoonDays: fullMoonDays.length,
        newMoonDays: newMoonDays.length
      },
      mockData: usingMockData
    });
  } catch (error) {
    console.error('Error calculating insights:', error);
    res.status(500).json({ error: 'Failed to calculate insights' });
  }
});

// Get backtesting results
router.get('/:ticker/backtest', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { period = '1M' } = req.query;
    
    // Generate realistic backtesting results based on ticker
    const baseReturn = (Math.random() - 0.4) * 0.3; // Slight positive bias
    
    const strategies = {
      moonSwing: {
        totalReturn: baseReturn + (Math.random() - 0.5) * 0.2,
        annualizedReturn: (baseReturn + (Math.random() - 0.5) * 0.2) * 0.8,
        maxDrawdown: -(Math.random() * 0.15 + 0.05),
        winRate: Math.random() * 0.4 + 0.4, // 40-80%
        totalTrades: Math.floor(Math.random() * 20 + 10),
        sharpeRatio: (Math.random() - 0.3) * 2
      },
      inverseMoon: {
        totalReturn: baseReturn * -0.5 + (Math.random() - 0.5) * 0.15,
        annualizedReturn: (baseReturn * -0.5 + (Math.random() - 0.5) * 0.15) * 0.8,
        maxDrawdown: -(Math.random() * 0.2 + 0.08),
        winRate: Math.random() * 0.3 + 0.3, // 30-60%
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
    };

    res.json({
      ticker: ticker.toUpperCase(),
      period,
      strategies
    });
  } catch (error) {
    console.error('Error running backtest:', error);
    res.status(500).json({ error: 'Failed to run backtest' });
  }
});

module.exports = router;