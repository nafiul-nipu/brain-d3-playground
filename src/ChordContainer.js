import * as d3 from 'd3'

import networkdata from './ep187_full_network.json'

// 100, 101, 201, 300 , 301, 400, 401, 501

// let data = Object.assign([
//     [.096899, .008859, .000554, .004430, .025471, .024363, .005537, .025471],
//     [.001107, .018272, .000000, .004983, .011074, .010520, .002215, .004983],
//     [.000554, .002769, .002215, .002215, .003876, .008306, .000554, .003322],
//     [.000554, .001107, .000554, .012182, .011628, .006645, .004983, .010520],
//     [.002215, .004430, .000000, .002769, .104097, .012182, .004983, .028239],
//     [.011628, .026024, .000000, .013843, .087486, .168328, .017165, .055925],
//     [.000554, .004983, .000000, .003322, .004430, .008859, .017719, .004430],
//     [.002215, .007198, .000000, .003322, .016611, .014950, .001107, .054264]
// ], {
//     names: ["Apple", "HTC", "Huawei", "LG", "Nokia", "Samsung", "Sony", "Other"],
//     colors: ["#c4c4c4", "#69b40f", "#ec1d25", "#c8125c", "#008fc8", "#10218b", "#134b24", "#737373"]
// })

export const ChordContainer = () => {

    const rois = [100, 101, 201, 300, 301, 400, 401, 501]

    console.log(networkdata)
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

    const textPadding = 1.2

    // console.log(chords)
    const base = width / 2
    const hB = height / 2
    // console.log(base, hB)
    const x = [base + (base * 3), base + 260, base + 280, base - 30, base + 650, base + 450, base + 100, base - 20]
    const y = [hB, hB, hB + 300, hB + 300, hB + 300, hB + 600, hB + 600, hB + 50]

    return (
        <svg width={window.innerWidth} height={window.innerHeight} className='top-svg'>
            {
                networkdata.map((nd, i) => {
                    // console.log(nd)
                    if (nd.roi !== 'rest' && nd.network.length !== 0) {
                        // console.log(nd)
                        let data = Object.assign(nd.matrix, { names: nd["electrodes"], colors: colorList })
                        const chords = chord(data)
                        const names = data.names === undefined ? d3.range(data.length) : data.names
                        const colors = data.colors === undefined ? d3.quantize(d3.interpolateRainbow, names.length) : data.colors
                        const color = d3.scaleOrdinal(names, colors)
                        return (
                            // <svg width={width} height={height}>
                            <g transform={`translate(${x[i]}, ${y[i]})`}>
                                {chords.groups.map((each) => {
                                    // console.log(each)
                                    let textTransform = chordArc.centroid(each);
                                    return (
                                        <g key={each.index}>
                                            <path
                                                fill={color(names[each.index])}
                                                d={chordArc(each)}
                                            /><title>{`${names[each.index]}
                                                ${(each.value)}`}</title>
                                            <text
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
                            </g>

                            // </svg>

                        )
                    }
                    else if (nd.roi !== 'rest') {
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
                        // console.log(Object.entries(obj))
                        // console.log(data_ready)

                        const donArc = d3.arc()
                            .innerRadius(innerRadius)
                            .outerRadius(outerRadius)
                            .padAngle(0.2)

                        return (
                            // <svg width={width} height={height}>
                            <g transform={`translate(${x[i]}, ${y[i]})`}>
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
                                                transform={`translate(${textTransform[0] * textPadding}, ${textTransform[1] * textPadding})`}
                                                // x={2}
                                                dy='0.35em'
                                                fontSize='0.85em'
                                                // fontWeight={'bold'}
                                                textAnchor={'middle'}
                                            >
                                                E{+each.data[0]}
                                            </text>

                                        </g>
                                    )
                                })}
                            </g>
                            // </svg>
                        )
                    } else {
                        const uniqueNames = [...new Set(nd.roiWithCount.map(item => item.count))];
                        console.log(uniqueNames)
                        const strokeWidthScale = d3.scaleLinear()
                            .domain([1, nd.maxCount])
                            .range([1, 6])

                        return (
                            nd['roiWithCount'].map((each) => {
                                // console.log(each)
                                let source = rois.indexOf(each.source)
                                let target = rois.indexOf(each.target)
                                return (
                                    <g className='aGroup'>
                                        <defs>
                                            <marker
                                                id="arrow"
                                                markerWidth="10"
                                                markerHeight="10"
                                                refX="0"
                                                refY="3"
                                                orient="auto"
                                                markerUnits="strokeWidth"
                                            >
                                                <path d="M0,0 L0,6 L9,3 z" fill="black" />
                                            </marker>
                                        </defs>
                                        <line
                                            x1={x[source]}
                                            y1={y[source]}
                                            x2={x[target]}
                                            y2={y[target]}
                                            stroke="black" strokeWidth={strokeWidthScale(each.count)} markerEnd="url(#arrow)"
                                        ></line>
                                    </g>
                                )
                            })
                        )
                    }
                })
            }

        </svg>
    )
}



