import * as d3 from 'd3';
export const AdjacencyMatrix = (props) => {
    const margin = { top: 100, right: 100, bottom: 100, left: 100 };
    const height = 350;
    const width = 350;

    var numrows = 5;
    var numcols = 5;

    var matrix = new Array(numrows);
    for (var i = 0; i < numrows; i++) {
        matrix[i] = new Array(numcols);
        for (var j = 0; j < numcols; j++) {
            matrix[i][j] = Math.random() * 2;
        }
    }
    let categories = [0, 1, 2, 3, 4];

    let x = d3.scaleBand()
        .domain(categories)
        .range([margin.left, width - margin.right])

    let y = d3.scaleBand()
        .domain([...categories].reverse())
        .range([height - margin.bottom, margin.top])

    let max_val = d3.max(matrix, d => d3.max(d))

    let color = d3.scaleLinear()
        .domain([0, max_val])
        .range(["#fcbba1", "#a50f15"])

    return (
        <svg width={width} height={height}>
            {
                matrix.map((row, i) => {
                    return (
                        row.map((col, j) => {
                            return (
                                <g>
                                    <rect
                                        key={i + "-" + j}
                                        x={x(i)}
                                        y={y(j)}
                                        width={x.bandwidth()}
                                        height={y.bandwidth()}
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
            <g></g>
        </svg>
    )

}