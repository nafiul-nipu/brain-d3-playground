import * as d3 from 'd3';
const regions = ["R. Frontal Lobe", "L. Frontal Lobe", "L. Parietal Lobe", "R. Temporal Lobe", "L. Temporal Lobe",
    "R. Occipital Lobe", "L. Occipital Lobe", "L. Insula"]

export const AdjacencyContainer = ({ networkdata }) => {
    const rois = [100, 101, 201, 300, 301, 400, 401, 501]
    const height = 350;
    const width = 350;
    const margin = { top: 100, right: 100, bottom: 100, left: 100 };

    const xScale = d3.scaleBand()
        // .domain(categories)
        .range([margin.left, width - margin.right])

    const yScale = d3.scaleBand()
        // .domain([...categories].reverse())
        .range([height - margin.bottom, margin.top])

    const color = d3.scaleLinear()
        .range(["#fcbba1", "#a50f15"])


    const base = width / 2
    const hB = height / 2
    // console.log(base, hB)
    const x = [base + (base * 3), base + 260, base + 280, base - 30, base + 650, base + 450, base + 100, base - 20]
    const y = [hB, hB, hB + 300, hB + 300, hB + 300, hB + 600, hB + 600, hB + 50]


    return (
        <svg width={window.innerWidth / 2} height={window.innerHeight - 20} className='top-svg'>
            {
                networkdata.map((nd, i) => {
                    // console.log(nd)
                    if (nd.roi === 'rest') {
                        const uniqueNames = [...new Set(nd.roiWithCount.map(item => item.count))];
                        uniqueNames.sort((a, b) => a - b);
                        // console.log(uniqueNames)
                        const strokeRange = Array.from({ length: uniqueNames.length }, (_, i) => 1 + i * 0.25);
                        // console.log(strokeRange)
                        const strokeWidthScale = d3.scaleOrdinal()
                            .domain(uniqueNames)
                            .range(strokeRange)

                        // console.log(d3.select(`#roi_100`).node().getBBox());
                        return (
                            nd['roiWithCount'].map((each) => {
                                // console.log(d3.select(`#roi_${each.source}`).node().getBBox())
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
                                                <path d="M0,0 L0,6 L9,3 z" fill="black" opacity={0.5} />
                                            </marker>
                                        </defs>
                                        <line
                                            x1={x[source]}
                                            y1={y[source]}
                                            x2={x[target]}
                                            y2={y[target]}
                                            stroke="black" strokeWidth={strokeWidthScale(each.count)} markerEnd="url(#arrow)" strokeOpacity={0.4}
                                        ></line><title>{`${+each.source} -> ${+each.target} = ${+each.count}`}</title>
                                    </g>
                                )
                            })
                        )
                    }

                    else {
                        console.log(nd)
                        let matrix = nd.matrix;
                        let max_val = d3.max(matrix, d => d3.max(d))
                        color.domain([0, max_val])
                        const categories = [...Array(nd.electrodes.length).keys()];
                        xScale.domain(categories);
                        yScale.domain(categories);
                        return (

                            <g transform={`translate(${x[i]}, ${y[i]})`} id={`roi_${nd.roi}`}>
                                {
                                    matrix.map((row, i) => {
                                        return (
                                            row.map((col, j) => {
                                                return (
                                                    <g>
                                                        <rect
                                                            key={i + "-" + j}
                                                            x={xScale(i)}
                                                            y={yScale(j)}
                                                            width={xScale.bandwidth()}
                                                            height={yScale.bandwidth()}
                                                            fill={color(col)}
                                                            rx={4}
                                                            ry={4}
                                                        />
                                                    </g>
                                                )
                                            })
                                        )
                                    })
                                }
                            </g>


                        )
                    }
                })
            }

        </svg>

    )

}