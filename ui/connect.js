let pixelCorrection = 2
let xPortCount = 1 //updown, up for in, down for out
let yPortCount = 1

function findBestPath(a, b, pp) {
    let nodes = [a]

    function foo(a, b, n) {
        let neigh = connectivityGraphs[pp][a]
        let dist = findDist(neigh[0], b)
        let bestn = neigh[0]
        for (let i = 1; i < neigh.length; i++) {
            if (neigh[i] == b) {
                bestn = b
                break
            }
            if (!(neigh[i] in n)) {
                let d2 = findDist(neigh[i], b)
                if (d2 < dist) {
                    bestn = neigh[i]
                    dist = d2
                }
            }
        }
        if ((new Set(n)).has(bestn)) {
            // TODO: find backtrack reason
            console.log("backtracked, due to blocked shortest 1 neighbour")
            return n
        }
        n.push(bestn)
        if (bestn == b) return n
        return foo(bestn, b, n)
    }
    return foo(a, b, nodes)
}

function findDist(xy, xy2) { //arbitary, not using sqrt for faster computation
    xy = xy.split("_").map(x => +(x))
    xy2 = xy2.split("_").map(x => +(x))
    return (Math.abs(xy[0] - xy2[0]) + Math.abs(xy[1] - xy2[1]))
}

function drawLinks(n1, n2) {
    let n12 = n1 + "_" + n2
        // let n11 = n1.replace(/\./g, '\\.')
        // let n21 = n2.replace(/\./g, '\\.')
    let p1 = n1.split('.').slice(0, -1).join('.')
    let p2 = n2.split('.').slice(0, -1).join('.')
        // let rect1 = $('#' + n11)[0],
        //     rect2 = $('#' + n21)[0];

    if (n12 in connectedLinks) {
        return
    }

    if (p1 == p2) {
        // if parents same, resolve internally
        let ports1 = rectPorts[n1]
        let ports2 = rectPorts[n2]
        let n1out = ports1[0]
        let n2in = ports2[1]
        let bestDist = findDist(n1out, n2in)
        for (let i = 1; i < ports1.length; i++) {
            for (let j = 1; j < ports2.length; j++) {
                let d1 = findDist(ports1[i], ports2[j])
                if (d1 > bestDist) {
                    n1out = ports1[i]
                    n2in = ports2[j]
                    bestDist = d1
                }
            }
        }

        let bp = findBestPath(n1out, n2in, p1)

        const svg = d3.select('svg')
        for (let i = 0; i < bp.length - 1; i++) {
            let x1y1 = bp[i].split('_');
            let x1 = +(x1y1[0])
            let y1 = +(x1y1[1])

            let x2y2 = bp[i + 1].split('_');
            let x2 = +(x2y2[0])
            let y2 = +(x2y2[1])

            svg.append('line')
                .style("stroke", "red")
                .style("stroke-width", 10 - p1.length)
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2);
        }
        return bp
    } else {
        // if diff parents
    }
}

function calculateConnectivity(parID, padding) {
    let links = {}
    let snappables = {
        'x': new Set(),
        'y': new Set()
    }
    padding = Math.round(padding / 2)
    let grects = $(".p" + parID.replace(/\./g, '\\.'));

    function findSnap(v, k) {
        let vlist = snappables[k]
        vlist.forEach(x => {
            if (Math.abs(v - x) <= pixelCorrection) {
                v = x
            }
        })
        snappables[k].add(v)
        return v
    }

    function addBidirect(a, b) {
        if (!(a in links)) {
            links[a] = []
        }
        if (!(b in links)) {
            links[b] = []
        }
        links[a].push(b)
        links[b].push(a)
    }

    function interpolate(a, b, cnt) {
        let v = []
        let interval = (b - a) / (cnt + 1)
        for (let i = 0; i < cnt + 1; i++) v.push(Math.round(a + interval * i))
        v.push(b)
        return v
    }

    let parentPorts = rectPorts[parID]
    if (parentPorts != undefined) {
        for (let i = 0; i < parentPorts.length; i++) { //map port to children
            let xy = parentPorts[i].split('_').map(x => +(x))
            if (i < xPortCount * 2) {
                xy = i % 2 == 0 ? [xy[0], findSnap(xy[1] + padding, "y")] : [xy[0], findSnap(xy[1] - padding, "y")] //up,down
            } else {
                xy = i % 2 == 0 ? [findSnap(xy[0] - padding, "x"), xy[1]] : [findSnap(xy[0] + padding, "x"), xy[1]] //left,right
            }
            addBidirect(parentPorts[i], xy[0] + "_" + xy[1])
            parentPorts[i] = xy.join('_')
        }
    }

    function checkParentPortsIntercept(x1, x2, y1, y2) {
        if (parentPorts == undefined) return
        for (let i = 0; i < parentPorts.length; i++) {
            let xy = parentPorts[i]
            if (i < parentPorts.length / 2) {
                if (xy[0] <= x2 && xy[0] >= x1 && y1 == xy[1] && y2 == y1) {
                    return xy
                }

            } else {
                if (xy[1] <= y2 && xy[1] >= y1 && xy[0] == x1 && x1 == x2) {
                    return xy
                }
            }
        }
    }

    function fo1(x1, x2, y) {
        let overlappedParentPort = checkParentPortsIntercept(x1, x2, y, y)
        let start = x1 + "_" + y
        let end = x2 + "_" + y
        if (overlappedParentPort) {
            let intercept = overlappedParentPort[0] + "_" + overlappedParentPort[1]
            if (intercept != end) {
                addBidirect(start, intercept)
                addBidirect(intercept, end)
            } else {
                addBidirect(start, end)
            }
        } else {
            addBidirect(start, end)
        }
    }

    function fo2(x, y1, y2) {
        let overlappedParentPort = checkParentPortsIntercept(x, x, y1, y2)
        let start = x + "_" + y1
        let end = x + "_" + y2
        if (overlappedParentPort) {
            let intercept = overlappedParentPort[0] + "_" + overlappedParentPort[1]
            if (intercept != end) {
                addBidirect(start, intercept)
                addBidirect(intercept, end)
            } else {
                addBidirect(start, end)
            }
        } else {
            addBidirect(start, end)
        }
    }


    for (let i = 0; i < grects.length; i++) {
        let x1 = +(grects[i].getAttribute('x')) - padding,
            y1 = +(grects[i].getAttribute('y')) - padding;

        let child = grects[i].firstChild;
        rectPorts[child.id] = []
        let width = +(child.getAttribute("width")) + 2 * padding
        let height = +(child.getAttribute("height")) + 2 * padding

        x1 = findSnap(x1, 'x')
        y1 = findSnap(y1, 'y')

        let x2 = findSnap(x1 + width, 'x')
        let y2 = findSnap(y1 + height, 'y')

        let xPorts = interpolate(x1, x2, xPortCount)
        let yPorts = interpolate(y1, y2, yPortCount)

        for (let i = 0; i < xPorts.length; i++) {
            if (i > 0 && i < xPorts.length - 1) {
                addBidirect(xPorts[i] + "_" + y1, xPorts[i] + "_" + (y1 + padding))
                rectPorts[child.id].push(xPorts[i] + "_" + (y1 + padding)) //up

                addBidirect(xPorts[i] + "_" + y2, xPorts[i] + "_" + (y2 - padding))
                rectPorts[child.id].push(xPorts[i] + "_" + (y2 - padding)) //down
            }
            if (i < xPorts.length - 1) {
                fo1(xPorts[i], xPorts[i + 1], y1)
                fo1(xPorts[i], xPorts[i + 1], y2)
            }
        }

        for (let i = 0; i < yPorts.length; i++) {
            if (i > 0 && i < yPorts.length - 1) {
                addBidirect((x2 - padding) + "_" + yPorts[i], x2 + "_" + yPorts[i])
                rectPorts[child.id].push((x2 - padding) + "_" + yPorts[i]) //left

                addBidirect((x1 + padding) + "_" + yPorts[i], x1 + "_" + yPorts[i])
                rectPorts[child.id].push((x1 + padding) + "_" + yPorts[i]) //right
            }
            if (i < yPorts.length - 1) {
                addBidirect(x1 + "_" + yPorts[i + 1], x1 + "_" + yPorts[i])
                addBidirect(x2 + "_" + yPorts[i + 1], x2 + "_" + yPorts[i])

                fo2(x1, yPorts[i], yPorts[i + 1])
                fo2(x2, yPorts[i], yPorts[i + 1])
            }
        }
    }

    return links
}

function debugDrawConnectivity(graph, padding) {
    const svg = d3.select('svg')
    Object.keys(graph).forEach(x1y1s => {
        //this draws double lines since graph is bidirectional
        x1y1 = x1y1s.split('_');
        let x1 = +(x1y1[0])
        let y1 = +(x1y1[1])
        graph[x1y1s].forEach(x2y2 => {
            x2y2 = x2y2.split('_');
            let x2 = +(x2y2[0])
            let y2 = +(x2y2[1])

            svg.append('line')
                .style("stroke", "red")
                .style("stroke-width", padding / 5)
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2);
        })

    })
}