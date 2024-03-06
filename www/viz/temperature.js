
let min = 0, max = 0

const temperature = {

    /*
    Static SQL used for the Viz. Will be returned
    as a mimic output of sqlite3's output (just a table).
    the response will be the inoput for processData
     */
    getSQL: () => {
        return "select   datetime(round(created), 'unixepoch') as created, " +
               "         round(((rvalue * 9/5) + 32), 0) as rvalue, " +
               "         sensor " +
               "from     sensor_data " +
               "where    sensor in ('temperature', 'soil_temp') " +
               "and      state != 'init' " +
               "order by created asc;"
    },

    /*
    will format the data into the shape required for the viz
    and the output will be th einput for getVizConfig
     */
    processData: (data) => {
        // reformat for vega
        for (const i in data) {
            data[i] = {
                "date": data[i][0],
                "rvalue": data[i][1],
                "sensor": data[i][2]
            }

            max = (max == 0 || max < data[i].rvalue) ? data[i].rvalue : max
            min = (min == 0 || min > data[i].rvalue) ? data[i].rvalue : min
        }

        return data
    },

    /*
    the vega-lite config
     */
    getVizConfig: (data) => {
        return {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "description": "Temperature over time",
            "width": "container",
            "data": { "values": data },
            "mark": "line",
            "encoding": {
                "x": {
                    "field": "date",
                    "type": "temporal"
                },
                "y": {
                    "field": "rvalue",
                    "type": "quantitative",
                    "scale": {"domain": [min, max]}
                },
                "color": {
                    "field": "sensor"
                }
            }
        }
    }
}
