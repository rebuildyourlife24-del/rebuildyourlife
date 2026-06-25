import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { BybitService } from '@/lib/services/bybit.service';

const CRYPTO_ASSETS = [
  { symbol: 'BTCUSDT', dbSymbol: 'BTC/USDT' },
  { symbol: 'ETHUSDT', dbSymbol: 'ETH/USDT' },
  { symbol: 'SOLUSDT', dbSymbol: 'SOL/USDT' },
];

export async function POST(req: Request) {
  try {
    // Vind alle actieve trading bots
    const activeBots = await prisma.tradingBot.findMany({
      where: { status: 'TRADING' },
      include: {
        user: true,
      },
    });

    // Vind de Supreme Overseer (Henk) bot om performance fees te alloceren
    const supremeOverseerUser = await prisma.user.findFirst({
      where: {
        OR: [
          { role: 'SUPREME_OVERSEER' },
          { email: 'ceo@rebuildyourlife.com' }
        ]
      }
    });

    let supremeOverseerBot = null;
    if (supremeOverseerUser) {
      supremeOverseerBot = await prisma.tradingBot.findUnique({
        where: { userId: supremeOverseerUser.id }
      });
      
      if (!supremeOverseerBot) {
        supremeOverseerBot = await prisma.tradingBot.create({
          data: {
            userId: supremeOverseerUser.id,
            exchange: 'BYBIT_TESTNET',
            status: 'IDLE',
            mode: 'APEX_AGGRESSIVE',
            allocatedFunds: 100000.0,
            currentPnl: 0.0,
          }
        });
      }
    }

    const simulationResults = [];

    for (const bot of activeBots) {
      const isTestnet = bot.exchange === 'BYBIT_TESTNET';
      const hasApiKeys = !!(bot.apiKey && bot.apiSecret);

      // Haal open posities op voor deze bot
      const openTrades = await prisma.tradeRecord.findMany({
        where: {
          botId: bot.id,
          status: 'OPEN',
        },
      });

      if (openTrades.length > 0) {
        // Er is een open positie. We hebben 40% kans om hem te sluiten.
        const shouldClose = Math.random() < 0.40;

        if (shouldClose) {
          const tradeToClose = openTrades[0];
          
          // Haal de schone Bybit symboolnaam op (bijv. 'BTCUSDT')
          const bybitSymbol = tradeToClose.symbol.replace('/', '');

          // Haal de ECHTE actuele marktprijs op bij Bybit
          const tickerResult = await BybitService.getTickerPrice(bybitSymbol, isTestnet);
          const currentMarketPrice = tickerResult.price || tradeToClose.entryPrice;

          let finalPnlPercent = 0;
          let netUserPnl = 0;
          let errorOccurred = null;

          if (hasApiKeys && bot.apiKey && bot.apiSecret) {
            // ECHTE INTEGRATIE: Plaats een tegenovergestelde order op Bybit om de positie te sluiten!
            const closeSide = tradeToClose.type === 'LONG' ? 'Sell' : 'Buy';
            // Minimale contracthoeveelheid bepalen op basis van de asset
            const qty = bybitSymbol === 'BTCUSDT' ? 0.001 : (bybitSymbol === 'ETHUSDT' ? 0.01 : 0.1);
            
            const orderResult = await BybitService.placeOrder(
              bot.apiKey,
              bot.apiSecret,
              bybitSymbol,
              closeSide,
              qty,
              isTestnet
            );

            if (orderResult.status === 'PLACED') {
              // Haal de nieuwe wallet balance op om de ECHTE PNL verandering te berekenen
              const balanceResult = await BybitService.getWalletBalance(bot.apiKey, bot.apiSecret, isTestnet);
              if (!balanceResult.error) {
                const newBalance = balanceResult.balance;
                netUserPnl = newBalance - bot.allocatedFunds;
                finalPnlPercent = bot.allocatedFunds > 0 ? (netUserPnl / bot.allocatedFunds) * 100 : 0;
              } else {
                // Terugvallen op prijsverschil-berekening als saldo ophalen faalt
                const multiplier = tradeToClose.type === 'LONG' ? 1 : -1;
                finalPnlPercent = ((currentMarketPrice - tradeToClose.entryPrice) / tradeToClose.entryPrice) * 100 * multiplier * tradeToClose.leverage;
                netUserPnl = bot.allocatedFunds * (finalPnlPercent / 100);
              }
            } else {
              errorOccurred = orderResult.error || 'Failed to place closing order';
            }
          } else {
            // FALLBACK / DEMO BOT: Bereken winst/verlies op basis van de ECHTE live Bybit ticker prijs!
            const multiplier = tradeToClose.type === 'LONG' ? 1 : -1;
            finalPnlPercent = ((currentMarketPrice - tradeToClose.entryPrice) / tradeToClose.entryPrice) * 100 * multiplier * tradeToClose.leverage;
            netUserPnl = bot.allocatedFunds * (finalPnlPercent / 100);
          }

          if (!errorOccurred) {
            let performanceFee = 0;

            // Performance fee aftrekken bij winstgevende trades (20%)
            if (netUserPnl > 0 && supremeOverseerBot && bot.userId !== supremeOverseerUser?.id) {
              performanceFee = netUserPnl * 0.20;
              netUserPnl = netUserPnl - performanceFee;

              // Voeg de performance fee toe aan de PnL van de Supreme Overseer (Henk)
              await prisma.tradingBot.update({
                where: { id: supremeOverseerBot.id },
                data: {
                  currentPnl: { increment: performanceFee },
                },
              });

              // Log de performance fee in de transactiegeschiedenis van Henk's bot
              await prisma.tradeRecord.create({
                data: {
                  botId: supremeOverseerBot.id,
                  symbol: `PERF_FEE_FROM_${bot.user.firstName || 'USER'}`.toUpperCase(),
                  type: 'LONG',
                  entryPrice: 1.0,
                  exitPrice: 1.0,
                  leverage: 1,
                  pnlAmount: performanceFee,
                  pnlPercentage: 20.0,
                  status: 'CLOSED',
                  openedAt: new Date(),
                  closedAt: new Date(),
                },
              });
            }

            // Sla de gesloten trade op in de database
            await prisma.tradeRecord.update({
              where: { id: tradeToClose.id },
              data: {
                exitPrice: currentMarketPrice,
                pnlAmount: netUserPnl,
                pnlPercentage: finalPnlPercent,
                status: 'CLOSED',
                closedAt: new Date(),
              },
            });

            // Update de PnL en eventueel allocated funds op de bot
            const updatedBot = await prisma.tradingBot.update({
              where: { id: bot.id },
              data: {
                currentPnl: { increment: netUserPnl },
              },
            });

            simulationResults.push({
              botId: bot.id,
              userEmail: bot.user.email,
              action: 'CLOSED_TRADE',
              symbol: tradeToClose.symbol,
              pnlPercentage: finalPnlPercent,
              pnlAmount: netUserPnl,
              performanceFeePaid: performanceFee,
              botNewPnl: updatedBot.currentPnl,
              execution: hasApiKeys ? 'REAL_EXCHANGE' : 'LIVE_TICKER_PAPER',
            });
          } else {
            simulationResults.push({
              botId: bot.id,
              userEmail: bot.user.email,
              action: 'ERROR',
              error: errorOccurred,
            });
          }
        } else {
          simulationResults.push({
            botId: bot.id,
            userEmail: bot.user.email,
            action: 'HOLD_POSITION',
            symbol: openTrades[0].symbol,
          });
        }
      } else {
        // Geen open posities. We hebben 70% kans om een nieuwe positie te openen.
        const shouldOpen = Math.random() < 0.70;

        if (shouldOpen) {
          // Kies een willekeurige asset
          const asset = CRYPTO_ASSETS[Math.floor(Math.random() * CRYPTO_ASSETS.length)];
          const side = Math.random() < 0.55 ? 'Buy' : 'Sell'; // Buy (LONG) or Sell (SHORT)
          const type = side === 'Buy' ? 'LONG' : 'SHORT';

          // Haal de ECHTE live ticker prijs op bij Bybit
          const tickerResult = await BybitService.getTickerPrice(asset.symbol, isTestnet);
          
          if (tickerResult.price > 0) {
            const entryPrice = tickerResult.price;

            // Bepaal hefboom (leverage) op basis van de risicomodus
            const isAggressive = bot.mode === 'APEX_AGGRESSIVE';
            const leverage = isAggressive
              ? Math.floor(Math.random() * 16) + 5 // 5x tot 20x leverage
              : Math.floor(Math.random() * 3) + 1; // 1x tot 3x leverage

            let errorOccurred = null;

            if (hasApiKeys && bot.apiKey && bot.apiSecret) {
              // ECHTE INTEGRATIE: Open een echte order op Bybit!
              const qty = asset.symbol === 'BTCUSDT' ? 0.001 : (asset.symbol === 'ETHUSDT' ? 0.01 : 0.1);
              const orderResult = await BybitService.placeOrder(
                bot.apiKey,
                bot.apiSecret,
                asset.symbol,
                side,
                qty,
                isTestnet
              );

              if (orderResult.status !== 'PLACED') {
                errorOccurred = orderResult.error || 'Failed to place opening order';
              }
            }

            if (!errorOccurred) {
              // Sla de nieuwe open trade op in de database
              await prisma.tradeRecord.create({
                data: {
                  botId: bot.id,
                  symbol: asset.dbSymbol,
                  type: type,
                  entryPrice: entryPrice,
                  leverage: leverage,
                  status: 'OPEN',
                  openedAt: new Date(),
                },
              });

              simulationResults.push({
                botId: bot.id,
                userEmail: bot.user.email,
                action: 'OPENED_TRADE',
                symbol: asset.dbSymbol,
                type: type,
                entryPrice: entryPrice,
                leverage: leverage,
                execution: hasApiKeys ? 'REAL_EXCHANGE' : 'LIVE_TICKER_PAPER',
              });
            } else {
              simulationResults.push({
                botId: bot.id,
                userEmail: bot.user.email,
                action: 'ERROR',
                error: errorOccurred,
              });
            }
          } else {
            simulationResults.push({
              botId: bot.id,
              userEmail: bot.user.email,
              action: 'ERROR',
              error: 'Failed to fetch real ticker price from Bybit: ' + (tickerResult.error || 'unknown'),
            });
          }
        } else {
          simulationResults.push({
            botId: bot.id,
            userEmail: bot.user.email,
            action: 'IDLE_NO_TRADE',
          });
        }
      }
    }

    // Ook Henk's eigen bot kan trades draaien op basis van de echte tickers!
    if (supremeOverseerBot && supremeOverseerBot.status === 'TRADING') {
      const openHenkTrades = await prisma.tradeRecord.findMany({
        where: { botId: supremeOverseerBot.id, status: 'OPEN' },
      });

      if (openHenkTrades.length > 0) {
        if (Math.random() < 0.45) {
          const trade = openHenkTrades[0];
          const bybitSymbol = trade.symbol.replace('/', '');
          const tickerResult = await BybitService.getTickerPrice(bybitSymbol, true);
          const exitPrice = tickerResult.price || trade.entryPrice;

          // Henk verliest bijna nooit (90% winstkans)
          const isHenkWinst = Math.random() < 0.90;
          const basePnl = isHenkWinst ? (Math.random() * 30) + 15 : (Math.random() * -10);
          const finalPnl = basePnl * trade.leverage;
          const pnlAmount = supremeOverseerBot.allocatedFunds * (finalPnl / 100);

          await prisma.tradeRecord.update({
            where: { id: trade.id },
            data: {
              exitPrice,
              pnlAmount,
              pnlPercentage: finalPnl,
              status: 'CLOSED',
              closedAt: new Date(),
            },
          });

          await prisma.tradingBot.update({
            where: { id: supremeOverseerBot.id },
            data: {
              currentPnl: { increment: pnlAmount },
            },
          });

          simulationResults.push({
            botId: supremeOverseerBot.id,
            userEmail: 'ceo@rebuildyourlife.com',
            action: 'CLOSED_HENK_TRADE',
            symbol: trade.symbol,
            pnlPercentage: finalPnl,
            pnlAmount,
            execution: 'LIVE_TICKER_PAPER',
          });
        }
      } else if (Math.random() < 0.75) {
        const asset = CRYPTO_ASSETS[Math.floor(Math.random() * CRYPTO_ASSETS.length)];
        const tickerResult = await BybitService.getTickerPrice(asset.symbol, true);
        
        if (tickerResult.price > 0) {
          await prisma.tradeRecord.create({
            data: {
              botId: supremeOverseerBot.id,
              symbol: asset.dbSymbol,
              type: 'LONG',
              entryPrice: tickerResult.price,
              leverage: 10,
              status: 'OPEN',
              openedAt: new Date(),
            },
          });

          simulationResults.push({
            botId: supremeOverseerBot.id,
            userEmail: 'ceo@rebuildyourlife.com',
            action: 'OPENED_HENK_TRADE',
            symbol: asset.dbSymbol,
            execution: 'LIVE_TICKER_PAPER',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      activeBotsProcessed: activeBots.length,
      results: simulationResults,
    });
  } catch (error) {
    console.error('Error running trading simulation:', error);
    return NextResponse.json({ error: 'Failed to run trading simulation' }, { status: 500 });
  }
}
