const rain = {

    /*
    Static SQL used for the Viz. Will be returned
    as a mimic output of sqlite3's output (just a table).
    the response will be the inoput for processData
     */
    getSQL: () => {
        return "select   datetime(round(created), 'unixepoch') as created, " +
               "         round(rvalue, 2) " +
               "from     sensor_data " +
               "where    sensor = 'rain_in' " +
               "and      state != 'init' " +
               "order by created desc "
    },

    /*
    will format the data into the shape required for the viz
    and the output will be th einput for getVizConfig
     */
    processData: (data) => {
        // reformat for vega
        for (const i in data) {
            data[i] = {
                "created": data[i][0],
                "rvalue": data[i][1]
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
            "description": "Rainfall over time",
            "width": "container",
            "data": { "values": data },
            "mark": "line",
            "encoding": {
                "x": {
                    "field": "created",
                    "type": "temporal"
                },
                "y": {
                    "field": "rvalue",
                    "type": "quantitative"
                }
            }
        }
    }
}
