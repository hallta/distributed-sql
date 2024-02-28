let vizzies = []

let registerVizzie = (viz) => {
    vizzies.push(viz)
}

const loadVizzies = () => {
    const canvases = ["#viz11"]
    for (const i in vizzies) {
        const canvas = canvases[i]
        const viz = vizzies[i]

        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:5000/sql/1/get',
            data: JSON.stringify( { "sql": viz.getSQL() }),
            headers: { 'Content-Type': 'application/json' },
            error: (e) => { console.error(e) },
            complete: (d) => {
                data = viz.processData(JSON.parse(d.responseText))
                vegaEmbed(canvas, viz.getVizConfig(data))
            }
        })

        // i have no idea how to disable the button
        // seemingly i could try harder but gave up
        setTimeout(()=>{$('details').remove()}, 100)

        if (!viz) continue;
    }
}

$(document).ready(() => {
    const loop = () => {
        loadVizzies()
    }

    setInterval(loop, 60000)
    loop()
})