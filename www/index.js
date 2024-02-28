$(document).ready(() => {

    // idea: 
    //   dashboard will be built with extensions (or something)
    //   --> two end points: config and data
    //   --> each gets re-ran async without page reload

    /*
    [{"year":1850,"age":0,"sex":1,"people":1483789},
    // [{"year":1850,"age":0,"sex":1,"people":1483789},
    vegaEmbed('#viz12', {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "A bar chart showing the US population distribution of age groups in 2000.",
        "height": { "step": 17 },
        "data": { "url": "data/population.json" },
        "transform": [{ "filter": "datum.year == 2000" }],
        "mark": "bar",
        "encoding": {
            "y": { "field": "age" },
            "x": {
                "aggregate": "sum", "field": "people",
                "title": "population"
            }
        }
    })
    */

    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000/sql/1/get',
        data: JSON.stringify({ "sql": "select * from foo" }),
        headers: { 'Content-Type': 'application/json' },
        error: (e) => {
            console.error(e)
        },
        complete: (d) => {
            data = JSON.parse(d.responseText)

            // hack for now 
            agg = {}
            for (let i in data) {
                agg[data[i][0]] = ( agg[data[i][0]] || 0 ) + 1
            }

            // reformat for vega
            v_agg = []
            for (let i in agg) {
                v_agg.push({
                    "a": i,
                    "b": agg[i]
                })
            }

            vegaEmbed('#viz11', {
                "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                "description": "A simple bar chart with embedded data.",
                "data": { "values": v_agg },
                "mark": "bar",
                "encoding": {
                    "x": { "field": "a", "type": "nominal", "axis": { "labelAngle": 0 } },
                    "y": { "field": "b", "type": "quantitative" }
                }
            })
        }
    })

})