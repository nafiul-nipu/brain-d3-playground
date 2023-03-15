import * as d3 from 'd3'
import { useEffect, useState } from 'react'
// 100, 101, 201, 300 , 301, 400, 401, 501
import roiElectrode from '../data/roi-electrode.json'

const regions = ["R. Frontal Lobe", "L. Frontal Lobe", "L. Parietal Lobe", "R. Temporal Lobe", "L. Temporal Lobe",
    "R. Occipital Lobe", "L. Occipital Lobe", "L. Insula"]

export const ChordContainerNetwork = ({ network, networkEvent, eventKey }) => {
    const [showParagraph, setShowParagraph] = useState(false);

    useEffect(() => {
        console.log("inside useEffect2")
        // console.log(networkdata)
        // if (network || networkEvent || eventKey) {
            // setShowParagraph(false)
            setShowParagraph(true);
        // }

    }, [eventKey]);    

    console.log(showParagraph)

    let networkdata;

    if (!networkEvent) {
        networkdata = network
    } else {
        let data = networkEvent.map((roi1, index) => ({
            ...roi1,
            electrodes: [...network[index].electrodes],
        }));
        networkdata = data


    }

    const rois = [100, 101, 201, 300, 301, 400, 401, 501]

    // console.log(networkdata)
    const colorList = ["#c4c4c4", "#69b40f", "#ec1d25", "#c8125c", "#008fc8", "#10218b", "#134b24", "#737373"]

    const height = 350;
    const width = 350;
    const outerRadius = Math.min(width, height) * 0.5 - 60;
    const innerRadius = outerRadius - 10

    const ribbon = d3.ribbonArrow()
        .radius(innerRadius - 1)
        .padAngle(0 / innerRadius)

    const chordArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)

    const chord = d3.chordDirected()
        .padAngle(10 / innerRadius)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending)

    const donArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .padAngle(0.08)

    const textPadding = 1.2

    // console.log(chords)
    const base = width / 2
    const hB = height / 2
    // console.log(base, hB)
    const x = [base + (base * 3), base + 260, base + 280, base - 30, base + 650, base + 450, base + 100, base - 20]
    const y = [hB, hB, hB + 300, hB + 300, hB + 300, hB + 600, hB + 600, hB + 50]



    return (
        <svg width={window.innerWidth / 2} height={window.innerHeight - 20} className='top-svg'>
            <g>
                {
                    networkdata.map((nd, i) => {
            
                        if (nd.roi === 'rest') {
                            const uniqueNames = [...new Set(nd.netWithCount.map(item => item.count))];
                            uniqueNames.sort((a, b) => a - b);
                      
                            const strokeRange = Array.from({ length: uniqueNames.length }, (_, i) => 1 + i * 0.25);
                         
                            const strokeWidthScale = d3.scaleOrdinal()
                                .domain(uniqueNames)
                                .range(strokeRange)

                            return (
                                showParagraph && nd.netWithCount.map((each, i) => {

                                    let sourceBox = d3.select(`#el_${each.source}`).node().getBoundingClientRect()
                                    let targetBox = d3.select(`#el_${each.target}`).node().getBoundingClientRect()

                                    // { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
                                    let source = [sourceBox.left + sourceBox.width / 2, sourceBox.top + sourceBox.height / 2]
                                    let target = [targetBox.left + targetBox.width / 2, targetBox.top + targetBox.height / 2]

                                    // let source = [sourceBox.x, sourceBox.y]
                                    // let target = [targetBox.x, targetBox.y]

                                    // translate(-280, 0)  === 0
                                    return (
                                        <g className='aGroup' transform="translate(-280, 0)">
                                            <line
                                                x1={source[0]}
                                                y1={source[1]}
                                                x2={target[0]}
                                                y2={target[1]}
                                                stroke="black" strokeWidth={strokeWidthScale(each.count)} markerEnd="url(#arrow)" strokeOpacity={0.6}
                                            ></line><title>{`${+each.source} -> ${+each.target} = ${+each.count}`}</title>
                                        </g>
                                    )

                                })
                            )
                        }
                        else
                        if (nd.roi !== 'rest' && nd.network.length !== 0) {
                            // console.log(nd)
                            let data = Object.assign(nd.matrix, { names: nd["electrodes"], colors: colorList })
                            const chords = chord(data)
                            // console.log(data)
                            // console.log(chords)
                            const names = data.names === undefined ? d3.range(data.length) : data.names
                            const colors = data.colors === undefined ? d3.quantize(d3.interpolateRainbow, names.length) : data.colors
                            const color = d3.scaleOrdinal(names, colors)
                            return (
                                // <svg width={width} height={height}>
                                <g transform={`translate(${x[i]}, ${y[i]})`} id={`roi_${nd.roi}`}>
                                    {chords.groups.map((each) => {
                                        // console.log(chordArc())
                                        // console.log(each)
                                        let textTransform = chordArc.centroid(each);
                                        return (
                                            <g key={each.index} >
                                                <path
                                                    fill={color(names[each.index])}
                                                    d={chordArc(each)}
                                                /><title>{`${names[each.index]}
                                                ${(each.value)}`}</title>
                                                <text
                                                    id={`el_${names[each.index]}`}
                                                    transform={`translate(${textTransform[0] * textPadding}, ${textTransform[1] * textPadding})`}
                                                    // x={2}
                                                    dy='0.35em'
                                                    // fontWeight={'bold'}
                                                    fontSize='0.75em'
                                                    textAnchor={'middle'}
                                                >
                                                    {names[each.index]}
                                                </text>

                                            </g>
                                        )
                                    })}
                                    {chords.map((each, i) => {
                                        return (
                                            <g fillOpacity={0.8} key={i} >
                                                <path
                                                    style={{ mixBlendMode: 'multiply' }}
                                                    fill={color(names[each.source.index])}
                                                    d={ribbon(each)}
                                                /><title>{`E${names[each.source.index]} → E${names[each.target.index]} = ${(each.source.value)}`}</title>
                                            </g>
                                        )
                                    })}

                                    <text
                                        transform={`translate(${textPadding}, ${textPadding * 115})`}
                                        fontWeight={'bold'}
                                    >{regions[i]}</text>
                                </g>

                                // </svg>

                            )
                        }
                        else if (nd.roi !== 'rest') {
                            // console.log()
                            let defaultValue = 10
                            // let data = nd.electrodes.map((e)=> )
                            const obj = nd.electrodes.reduce((acc, val) => {
                                acc[val] = defaultValue;
                                return acc;
                            }, {});
                            // console.log(obj)
                            var color = d3.scaleOrdinal()
                                .domain(Object.keys(obj))
                                .range(colorList)

                            var pie = d3.pie()
                                .value(function (d) { return d[1]; })
                            var data_ready = pie(Object.entries(obj))
                            
                            return (
                                // <svg width={width} height={height}>
                                <g transform={`translate(${x[i]}, ${y[i]})`} id={`roi_${nd.roi}`}>
                                    {data_ready.map((each, i) => {
                                        // console.log(each)
                                        let textTransform = donArc.centroid(each);
                                        return (
                                            <g key={i}>
                                                <path
                                                    fill={color(each.index)}
                                                    d={donArc(each)}
                                                /><title>{`E${+each.data[0]}`}</title>
                                                <text
                                                    id={`el_${each.data[0]}`}
                                                    transform={`translate(${textTransform[0] * textPadding}, ${textTransform[1] * textPadding})`}
                                                    // x={2}
                                                    dy='0.35em'
                                                    fontSize='0.85em'
                                                    // fontWeight={'bold'}
                                                    textAnchor={'middle'}
                                                >
                                                    {+each.data[0]}
                                                </text>

                                            </g>
                                        )
                                    })}
                                    <text
                                        transform={`translate(${textPadding}, ${textPadding * 115})`}
                                        fontWeight={'bold'}
                                    >{regions[i]}</text>
                                </g>
                                // </svg>
                            )
                        }
                    })
                }
            </g>
        </svg >
    )
}



