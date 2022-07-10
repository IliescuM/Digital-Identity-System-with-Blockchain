import React from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto';
import { Container } from 'reactstrap'
import { Card } from 'reactstrap';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

function GraphDashboard({ price, data, currency }) {
    const opts = {
        tooltips: {
            intersect: false,
            mode: "index"
        },
        responsive: true,
        maintainAspectRatio: false
    };
    if (price === "0.00") {


        return <h3>Please select a currency pair</h3>;
    }
    const handleIdx = () => {
        if (currency == "ETH-USD") {
            return <h3>{`$${price}`}</h3>
        }
        else return <h3>{`€${price}`}</h3>
    }
    return (
        <div className="dashboard">

            {handleIdx()}


            <div className="chart-container">
                <Line data={data} options={opts} />
            </div>

        </div>
    );
}

export default GraphDashboard
