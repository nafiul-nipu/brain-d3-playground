import { useEffect, useState } from "react"
import { json } from "d3";

export const useFullNetworkPerEvent = ({
    sample
}) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        // console.log('before', patientID, sample)
        if (sample) {
            // console.log('after', patientID, sample)
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-d3-playground/master/src/data/ep187_${sample}_full_network_event_new.json`;
            json(url).then(jData => {
                // const filteredData = jData.filter((item) => item.count > 1)
                // setData(filteredData);
                setData(jData);
            })

        }
    }, [sample])

    return data;
}

