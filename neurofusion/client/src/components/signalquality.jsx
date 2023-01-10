import { React, useState, useEffect } from 'react';
import brainMontage from "../assets/neurosity_montage.png";
import ReactEcharts from "echarts-for-react";
import { notion } from "../services/neurosity";


export default function SignalQuality({channelNames, deviceStatus}) {

    const [signalQualityArray, setSignalQualityArray] = useState([]);
    const [signalQualityValues, setSignalQualityValues] = useState({});
    const [signalQualityChartOptions, setSignalQualityChartOptions] = useState({});

    // feed signal quality values into array
    useEffect(() => {
        if (deviceStatus === "online") {
            const subscribeToLiveFeed = async () => {
                await notion.signalQuality().subscribe(async (signalQuality) => {
                    const formattedSignalQuality = await formatSignalQuality(signalQuality);
                    setSignalQualityArray(sigArray => [...sigArray, formattedSignalQuality]);
                });
            };
            subscribeToLiveFeed();
        }
    }, [deviceStatus]);

    // average the signal quality values every 50 samples
    useEffect(() => {
        if (signalQualityArray.length >= 50) {
            (async () => {
                const avgSigQuality = await averageSignalQuality(signalQualityArray)
                setSignalQualityValues(avgSigQuality)
                // empty the array
                setSignalQualityArray([])
            })();
        }
    }, [signalQualityArray])

    // update chart options when signal quality values change
    useEffect(() => {
        const valueData = [];
        for (let i = 0; i < channelNames.length; i++) {
            valueData.push(signalQualityValues[channelNames[i] + "_value"]);
        }

        // get the chart series and generate options
        const option = {
            title: {
                text: 'Live signal quality feed',
            },
            grid: { containLabel: true },
            xAxis: {
                name: "channelName",
                data: channelNames,
                type: "category",
            },
            yAxis: { name: 'signalQualityValue', type: 'value' },
            series: [
                {
                    data: valueData,
                    type: "bar",
                    itemStyle: {
                        color: function (params) {
                            if (params.value >= 15) { // bad
                                return 'red';
                            } else if (params.value >= 10) { // good
                                return 'yellow';
                            } else if (params.value >= 1.5) { // great
                                return 'green';
                            } else { // no contact
                                return 'grey';
                            }
                        }
                    }
                },
            ],
        };
        setSignalQualityChartOptions(option)
    }, [signalQualityValues])

    // helper functions
    function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

    async function formatSignalQuality(signalQuality) {
        let formattedSignalQuality = {
            'unixTimestamp_secs': Math.floor(Date.now()),
        }
        for (let ch_index = 0; ch_index < channelNames.length; ch_index++) {
            let ch_name = channelNames[ch_index];
            formattedSignalQuality[ch_name + "_value"] = signalQuality[ch_index].standardDeviation;
            formattedSignalQuality[ch_name + "_status"] = signalQuality[ch_index].status;
        }
        return formattedSignalQuality;
    }

    async function averageSignalQuality(signalQualityArray) {
        const averageSignalQuality = {}
        for (var channel in channelNames) {
            let channelName = channelNames[channel]
            let channelValues = signalQualityArray.map((sample) => sample[channelName + "_value"]).filter(isNumber)
            let channelAverage = channelValues.reduce((a, b) => a + b, 0) / channelValues.length;
            averageSignalQuality[channelName + "_value"] = channelAverage;
        }
        return averageSignalQuality;
    }

    let montageStyle =
        { display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" };


    return (
        <div id="signalquality">
            <h2>Signal Quality</h2>

            <div id="sidebars" style={{ display: 'flex' }}>

                <div style={{ width: '50%', textAlign: 'center' }}>
                    <ReactEcharts option={signalQualityChartOptions} />

                    <p>Signal quality thresholds: <strong>bad >= 15, good >= 10, great >= 1.5</strong></p>
                    <p>Sit still for about 10 seconds after adjusting to see signal average</p>
                </div>

                <div style={montageStyle}>
                    {/* add image of brain montage */}
                    <img src={brainMontage} alt="brain montage" width={'700px'} />
                </div>

            </div>
        </div>
    )
}