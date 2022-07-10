import React, { useEffect, useRef, useState } from 'react'
import { Container } from 'reactstrap'
import GraphDashboard from './GraphDashboard'
import { formatData } from '../utils'

export function GraphEth() {
    const [currencies, setcurrencies] = useState([]);
    const [pair, setpair] = useState("");
    const [price, setprice] = useState("0.00");
    const [pastData, setpastData] = useState({});
    const [idx, setidx] = useState("");
    const ws = useRef(null);

    let first = useRef(false);
    const url = "https://api.pro.coinbase.com";

    useEffect(() => {
        ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");

        let pairs = [];

        const apiCall = async () => {
            await fetch(url + "/products")
                .then((res) => res.json())
                .then((data) => (pairs = data));

            let filtered = pairs.filter((pair) => {
                if ((pair.quote_currency === "USD" || pair.quote_currency === "EUR") && pair.base_currency === "ETH") {
                    return pair;
                }
            });

            filtered = filtered.sort((a, b) => {
                if (a.base_currency < b.base_currency) {
                    return -1;
                }
                if (a.base_currency > b.base_currency) {
                    return 1;
                }
                return 0;
            });


            setcurrencies(filtered);

            first.current = true;
        };

        apiCall();
    }, []);

    useEffect(() => {
        if (!first.current) {

            return;
        }


        let msg = {
            type: "subscribe",
            product_ids: [pair],
            channels: ["ticker"]
        };
        let jsonMsg = JSON.stringify(msg);
        ws.current.send(jsonMsg);

        let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
        const fetchHistoricalData = async () => {
            let dataArr = [];
            await fetch(historicalDataURL)
                .then((res) => res.json())
                .then((data) => (dataArr = data));

            let formattedData = formatData(dataArr);
            setpastData(formattedData);
        };

        fetchHistoricalData();

        ws.current.onmessage = (e) => {
            let data = JSON.parse(e.data);
            if (data.type !== "ticker") {
                return;
            }

            if (data.product_id === pair) {
                setprice(data.price);

            }
        };
    }, [pair]);

    const handleSelect = (e) => {
        let unsubMsg = {
            type: "unsubscribe",
            product_ids: [pair],
            channels: ["ticker"]
        };
        let unsub = JSON.stringify(unsubMsg);

        ws.current.send(unsub);

        setpair(e.target.value);

    };
    return (
        <div className="container">
            {
                <select name="currency" value={pair} onChange={handleSelect}>
                    {currencies.map((curr, idx) => {



                        return (
                            <option key={idx} value={curr.id}>
                                {curr.display_name}
                            </option>
                        );
                    })}
                </select>
            }
            <GraphDashboard price={price} data={pastData} currency={pair} />
        </div>
    );
}

export default GraphEth