import * as d3 from 'd3'

export const ChordContainer = () => {
    let data = Object.assign([
        [.096899, .008859, .000554, .004430, .025471, .024363, .005537, .025471],
        [.001107, .018272, .000000, .004983, .011074, .010520, .002215, .004983],
        [.000554, .002769, .002215, .002215, .003876, .008306, .000554, .003322],
        [.000554, .001107, .000554, .012182, .011628, .006645, .004983, .010520],
        [.002215, .004430, .000000, .002769, .104097, .012182, .004983, .028239],
        [.011628, .026024, .000000, .013843, .087486, .168328, .017165, .055925],
        [.000554, .004983, .000000, .003322, .004430, .008859, .017719, .004430],
        [.002215, .007198, .000000, .003322, .016611, .014950, .001107, .054264]
    ], {
        names: ["Apple", "HTC", "Huawei", "LG", "Nokia", "Samsung", "Sony", "Other"],
        colors: ["#c4c4c4", "#69b40f", "#ec1d25", "#c8125c", "#008fc8", "#10218b", "#134b24", "#737373"]
    })

    const names = data.names === undefined ? d3.range(data.length) : data.names
    const colors = data.colors === undefined ? d3.quantize(d3.interpolateRainbow, names.length) : data.colors

    const height = 500;
    const width = 500;
    const outerRadius = Math.min(width, height) * 0.5 - 60;
    const innerRadius = outerRadius - 10
    const color = d3.scaleOrdinal(names, colors)
    const ribbon = d3.ribbon()
        .radius(innerRadius - 1)
        .padAngle(1 / innerRadius)

    const chordArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)

    const chord = d3.chord()
        .padAngle(10 / innerRadius)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending)

    const labelRadius = (innerRadius * 0.2 + outerRadius * 0.8)
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    const chords = chord(data)

    // console.log(chords.groups)

    return (
        <div>
            <svg width={width} height={height}>
                <g transform={`translate(${width / 2}, ${height / 2})`}>
                    {chords.groups.map((each) => {
                        // console.log(chordArc.centroid(each))
                        let textTransform = chordArc.centroid(each);
                        return (
                            <g>
                                <path
                                    fill={color(names[each.index])}
                                    d={chordArc(each)}
                                /><title>{`${names[each.index]}
                                ${(each.value)}`}</title>
                                <text
                                    transform={`translate(${textTransform[0] * 1.2}, ${textTransform[1] * 1.2})`}
                                    // x={2}
                                    dy='0.35em'
                                    fontWeight={'bold'}
                                    textAnchor={'middle'}
                                >
                                    {names[each.index]}
                                </text>

                            </g>
                        )
                    })}
                    {chords.map((each) => {
                        return (
                            <g fillOpacity={0.8}>
                                <path
                                    style={{ mixBlendMode: 'multiply' }}
                                    fill={color(names[each.source.index])}
                                    d={ribbon(each)}
                                /><title>{`${(each.source.value)} ${names[each.target.index]} → ${names[each.source.index]}${each.source.index === each.target.index ? ""
                                    : `\n${(each.target.value)} ${names[each.source.index]} → ${names[each.target.index]}`}`}</title>
                            </g>
                        )
                    })}
                </g>
            </svg>
        </div>
    )
}