# Development Guidelines for Stock vs Moon Dashboard

## 🚀 Getting Started

This project combines financial data analysis with astronomical calculations to explore potential correlations between stock market movements and lunar cycles.

## 🏗️ Architecture

### Frontend (React + Vite)
- **Location**: `frontend/`
- **Port**: 3000
- **Key Components**:
  - `StockChart.jsx` - Interactive price charts with moon phase overlays
  - `InsightsPanel.jsx` - AI-powered statistical analysis
  - `BacktestPanel.jsx` - Strategy performance testing
  - `MultiStockComparison.jsx` - Compare multiple assets

### Backend (Node.js + Express)
- **Location**: `backend/`
- **Port**: 3001
- **Key Files**:
  - `server.js` - Express server setup
  - `routes/stock.js` - API endpoints for stock data and moon phases

## 🔧 Development Workflow

### 1. Environment Setup
```bash
# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Configure environment
cp .env.example .env
# Add your AlphaVantage API key to .env
```

### 2. Development Server
```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:backend  # Backend only
npm run dev:frontend # Frontend only
```

### 3. API Integration
- **AlphaVantage**: Stock market data
- **SunCalc**: Moon phase calculations
- **Mock Data**: Fallback when API unavailable

## 📊 Key Features to Understand

### Moon Phase Analysis
- Uses SunCalc library for accurate astronomical calculations
- Correlates stock price movements with lunar cycles
- Provides statistical insights on phase-based returns

### Strategy Backtesting
- **Moon Swing**: Buy new moon → sell full moon
- **Inverse Moon**: Buy full moon → sell new moon
- **Buy & Hold**: Traditional baseline comparison

### Multi-Stock Comparison
- Compare up to 5 stocks simultaneously
- Visual performance analysis
- Cross-asset lunar correlation patterns

## 🎯 Development Tips

### Adding New Features
1. **Frontend Components**: Add to `frontend/src/components/`
2. **API Endpoints**: Extend `backend/routes/stock.js`
3. **Styling**: Update `frontend/src/index.css`

### Testing
- Test with different stock tickers (AAPL, TSLA, GOOGL)
- Verify moon phase calculations
- Check responsive design on mobile

### Performance
- API calls are cached for better performance
- Mock data fallback prevents API limit issues
- Responsive charts handle large datasets

## 🐛 Common Issues

### API Rate Limits
- AlphaVantage free tier: 5 requests/minute
- App automatically falls back to mock data
- Get premium key for production use

### CORS Issues
- Backend configured for localhost:3000
- Update CORS settings for production deployment

### Build Issues
- Ensure Node.js 18+ is installed
- Clear node_modules if dependency conflicts occur
- Check port availability (3000, 3001)

## 📚 Resources

- [AlphaVantage API Docs](https://www.alphavantage.co/documentation/)
- [SunCalc Library](https://github.com/mourner/suncalc)
- [Recharts Documentation](https://recharts.org/)
- [React + Vite Guide](https://vitejs.dev/guide/)

## 🔄 Deployment

### Docker
```bash
docker-compose up --build
```

### Manual Deployment
1. Build frontend: `cd frontend && npm run build`
2. Serve static files from `frontend/dist/`
3. Run backend: `cd backend && npm start`

## 💡 Future Enhancements

- Real-time WebSocket updates
- More sophisticated backtesting algorithms
- Additional astronomical events (eclipses, planetary alignments)
- Machine learning pattern recognition
- Social sentiment analysis integration