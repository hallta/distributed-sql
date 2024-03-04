const air_pressure = {

    /*
    Static SQL used for the Viz. Will be returned
    as a mimic output of sqlite3's output (just a table).
    the response will be the inoput for processData
    */
    getSQL: () => {
        return "select   created, rvalue " +
               "from     sensor_data " +
               "where    sensor = 'temperature' " +
	       "and      state != 'init' " +
               "order by created;"
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
                "rvalue": data[i][1]
            }
        }

        return data
    },

    /*
    the vega-lite config
    */
    getVizConfig: (data) => {
        return {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "description": "A scatterplot showing body mass and flipper lengths of penguins.",
            "data": { "values": data },
            "mark": "point",
            "encoding": {
                "x": {
                    "field": "date",
                    "type": "temporal",
                    "scale": { "zero": false }
                },
                "y": {
                    "field": "rvalue",
                    "type": "quantitative",
                    "scale": { "zero": false }
                }
            }
        }
    }
}
