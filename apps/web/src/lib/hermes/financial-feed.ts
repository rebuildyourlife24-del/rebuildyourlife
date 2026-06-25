import yahooFinance from 'yahoo-finance2';

export async function fetchFinancialData() {
  console.log('[FINANCIAL FEED] Fetching live market data...');
  
  const results = {
    crypto: {} as Record<string, any>,
    stocks: [] as any[],
    timestamp: new Date().toISOString()
  };

  try {
    // 1. Fetch Crypto Data (CoinGecko Free API)
    const cryptoIds = 'bitcoin,ethereum,solana,chainlink,avalanche-2,render-token';
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true`, {
      next: { revalidate: 300 } // cache for 5 minutes
    });
    
    if (response.ok) {
      results.crypto = await response.json();
      console.log('[FINANCIAL FEED] Crypto data fetched successfully.');
    } else {
      console.warn('[FINANCIAL FEED] CoinGecko API returned status:', response.status);
    }
  } catch (error) {
    console.error('[FINANCIAL FEED] Failed to fetch crypto data:', error);
  }

  try {
    // 2. Fetch Stocks/ETFs (Yahoo Finance)
    const symbols = [
      'SPY',   // S&P 500
      'QQQ',   // Nasdaq 100
      'GC=F',  // Gold
      'NVDA',  // Nvidia (AI indicator)
      'TSLA',  // Tesla (Retail sentiment)
    ];

    const quotes: any = await yahooFinance.quote(symbols);
    results.stocks = (quotes as any[]).map((q: any) => ({
      symbol: q.symbol,
      price: q.regularMarketPrice,
      changePercent: q.regularMarketChangePercent,
      volume: q.regularMarketVolume
    }));
    console.log('[FINANCIAL FEED] Stock data fetched successfully.');
  } catch (error) {
    console.error('[FINANCIAL FEED] Failed to fetch stock data:', error);
  }

  return results;
}

