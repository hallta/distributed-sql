const day_rainfall = {

    /*
    Static SQL used for the Viz. Will be returned
    as a mimic output of sqlite3's output (just a table).
    the response will be the inoput for processData
     */
    getSQL: () => {
        return "select   round(sum(rvalue / 25.4),2) as rvalue " +
               "from     sensor_data " +
               "where    sensor = 'rain_in' " +
               "and      state != 'init' " +
               "order by created desc " + 
               "limit 2880;"
    },

    /*
    will format the data into the shape required for the viz
    and the output will be th einput for getVizConfig
     */
    processData: (data) => {
        // reformat for vega
        for (const i in data) {
            data[i] = { "rvalue": data[i][0] }
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
            "data": { "values": data },
            "mark": "text",
            "encoding": {
                "text": {
                    "field": "rvalue",
                    "type": "quantitative"
                }
            },
            "config": {
                "view": {
                    "stroke": "transparent"
                }
            }
        }
    }
}
