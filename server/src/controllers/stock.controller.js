export async function getStock(req, reply) {
    const { country, symbol } = req.query;
    const API_KEY = process.env.API_KEY;

    const symbolUrl = `https://finnhub.io/api/v1/stock/symbol?exchange=${country}&token=${API_KEY}`;

    try {
        const symbolResponse = await fetch(symbolUrl);
        const symbolData = await symbolResponse.json();

        const filteredSymbolData = symbolData.filter(
            (stock) => stock.symbol === symbol
        );

        if (filteredSymbolData.length === 0) {
            return reply.code(404).send({ error: "Symbol not found" });
        }

        const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
        const quoteResponse = await fetch(quoteUrl);
        const quoteData = await quoteResponse.json();

        reply.code(200).send({
            symbolInfo: filteredSymbolData[0],
            quote: quoteData
        });
    } catch (error) {
        reply.code(500).send({ error: "Failed to fetch stock data" });
    }
}
