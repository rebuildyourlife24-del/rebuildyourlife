import crypto from 'crypto';

export class BybitService {
  private static getBaseUrl(isTestnet: boolean): string {
    return isTestnet ? 'https://api-testnet.bybit.com' : 'https://api.bybit.com';
  }

  private static generateSignature(
    apiKey: string,
    apiSecret: string,
    timestamp: number,
    recvWindow: number,
    paramString: string
  ): string {
    const signString = timestamp.toString() + apiKey + recvWindow.toString() + paramString;
    return crypto.createHmac('sha256', apiSecret).update(signString).digest('hex');
  }

  /**
   * Haalt het realtime accountsaldo op bij Bybit (Unified Trading Account)
   */
  public static async getWalletBalance(
    apiKey: string,
    apiSecret: string,
    isTestnet: boolean = true
  ): Promise<{ balance: number; currency: string; error?: string }> {
    try {
      const baseUrl = this.getBaseUrl(isTestnet);
      const path = '/v5/account/wallet-balance';
      const timestamp = Date.now();
      const recvWindow = 5000;
      const queryParams = 'accountType=UNIFIED';
      
      const signature = this.generateSignature(apiKey, apiSecret, timestamp, recvWindow, queryParams);
      
      const response = await fetch(`${baseUrl}${path}?${queryParams}`, {
        method: 'GET',
        headers: {
          'X-BAPI-API-KEY': apiKey,
          'X-BAPI-TIMESTAMP': timestamp.toString(),
          'X-BAPI-SIGN': signature,
          'X-BAPI-RECV-WINDOW': recvWindow.toString(),
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.retCode !== 0) {
        return { balance: 0, currency: 'USDT', error: data.retMsg || 'Bybit returned error code ' + data.retCode };
      }

      // Zoek naar USDT of pak het totale saldo
      const list = data.result?.list?.[0];
      if (!list) {
        return { balance: 0, currency: 'USDT', error: 'No account data returned' };
      }

      const totalEquity = parseFloat(list.totalEquity || '0');
      const totalWalletBalance = parseFloat(list.totalWalletBalance || '0');
      
      // Als UTA leeg is, pak USDT wallet balance van spot of contract
      const coins = list.coin || [];
      const usdtCoin = coins.find((c: any) => c.coin === 'USDT');
      const usdtBalance = usdtCoin ? parseFloat(usdtCoin.walletBalance || '0') : 0;

      return {
        balance: totalEquity > 0 ? totalEquity : (totalWalletBalance > 0 ? totalWalletBalance : usdtBalance),
        currency: 'USD',
      };
    } catch (err: any) {
      console.error('Bybit getWalletBalance error:', err);
      return { balance: 0, currency: 'USDT', error: err.message };
    }
  }

  /**
   * Haalt de actuele prijs op voor een trading pair
   */
  public static async getTickerPrice(
    symbol: string,
    isTestnet: boolean = true
  ): Promise<{ price: number; error?: string }> {
    try {
      const baseUrl = this.getBaseUrl(isTestnet);
      // Gebruik perpetual futures (linear) of spot op basis van symbool
      const category = 'linear';
      const path = `/v5/market/tickers?category=${category}&symbol=${symbol}`;
      
      const response = await fetch(`${baseUrl}${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.retCode !== 0) {
        return { price: 0, error: data.retMsg };
      }

      const ticker = data.result?.list?.[0];
      if (!ticker) {
        return { price: 0, error: 'Ticker data not found' };
      }

      const lastPrice = parseFloat(ticker.lastPrice || '0');
      return { price: lastPrice };
    } catch (err: any) {
      console.error('Bybit getTickerPrice error:', err);
      return { price: 0, error: err.message };
    }
  }

  /**
   * Plaatst een market of limit order op Bybit
   */
  public static async placeOrder(
    apiKey: string,
    apiSecret: string,
    symbol: string,
    side: 'Buy' | 'Sell',
    qty: number,
    isTestnet: boolean = true
  ): Promise<{ orderId: string; status: string; error?: string }> {
    try {
      const baseUrl = this.getBaseUrl(isTestnet);
      const path = '/v5/order/create';
      const timestamp = Date.now();
      const recvWindow = 5000;
      
      // Bybit body parameters
      const body = {
        category: 'linear',
        symbol: symbol,
        side: side, // 'Buy' or 'Sell'
        orderType: 'Market',
        qty: qty.toString(),
        timeInForce: 'GTC',
      };
      
      const bodyString = JSON.stringify(body);
      const signature = this.generateSignature(apiKey, apiSecret, timestamp, recvWindow, bodyString);
      
      const response = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'X-BAPI-API-KEY': apiKey,
          'X-BAPI-TIMESTAMP': timestamp.toString(),
          'X-BAPI-SIGN': signature,
          'X-BAPI-RECV-WINDOW': recvWindow.toString(),
          'Content-Type': 'application/json',
        },
        body: bodyString,
      });

      const data = await response.json();
      
      if (data.retCode !== 0) {
        return { orderId: '', status: 'FAILED', error: data.retMsg || 'Order placement failed' };
      }

      return {
        orderId: data.result?.orderId || '',
        status: 'PLACED',
      };
    } catch (err: any) {
      console.error('Bybit placeOrder error:', err);
      return { orderId: '', status: 'FAILED', error: err.message };
    }
  }
}
