import React, {useState, useEffect} from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral';

const options ={
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll"
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

function LineGraph({ casesType='cases' }) {

    const [chartData, setchartData] = useState({})

    const buildChartData = (data, casesType='cases') => {
        const chartData = []
        let lastData;
        for(let date in data.cases){
            if(lastData)
            {
                let newData={
                    x: date,
                    y: data[casesType][date] - lastData
                }
                chartData.push(newData)
            }
            lastData = data[casesType][date]
        }
        return chartData
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(res => res.json())
            .then(data => {
                const chartData = buildChartData(data)
                console.log(chartData)
                setchartData(chartData)
            })
        }
        fetchData()
    }, [casesType])

    return (
        <div className="linegraph">
            {chartData.length > 0 && 
            <Line 
                options={options}
                data={{
                    datasets: [{
                        backgroundColor: "rgba(204, 16, 52, 0.5)",
                        borderColor: "#CC1034",
                        data: chartData
                    }]
                }}    
            />
        }
        </div>
    )
}

export default LineGraph
