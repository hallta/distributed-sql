$(document).ready(() => {

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