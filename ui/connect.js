let pixelCorrection = 5 //increase to reduce path search problem
let xPortCount = 1 //updown, up for in, down for out
let yPortCount = 1

function findBestPath(a, b, pp) {
    let s1 = [
        [a]
    ]
    let covered = new Set([a])
    while (s1.length > 0) {
        let path = s1.shift()
        let lastNode = path.slice(-1)
        let neigh = []
        connectivityGraphs[pp][lastNode].forEach(x => {
            if (!(covered.has(x))) neigh.push(x)
        })
        for (let i = 0; i < neigh.length; i++) {
            let n = neigh[i]
            if (n == b) {
                return path.concat(n)
            }
            covered.add(n)
            s1.push(path.concat(n))
        }
    }
    console.log("No path found")
    return []
}

function findDist(xy, xy2) { //arbitary, not using sqrt for faster computation
    xy = xy.split("_").map(x => +(x))
    xy2 = xy2.split("_").map(x => +(x))
    return (Math.abs(xy[0] - xy2[0]) + Math.abs(xy[1] - xy2[1]))
}

function drawLinks(n1, n2) {
    if (n1 == n2) return []
    let n12 = n1 + "_" + n2
        // let n11 = n1.replace(/\./g, '\\.')
        // let n21 = n2.replace(/\./g, '\\.')
    let p1 = n1.split('.').slice(0, -1).join('.')
    let p2 = n2.split('.').slice(0, -1).join('.')
    let n1s = n1.split('.')
    let n2s = n2.split('.')
    let n1level = n1s.length
    let n2level = n2s.length

    let n1out = rectPorts[n1][0]
    let n2in = rectPorts[n2][1]

    function drawSVGLines(nodes, c, l) {
        const base = d3.select('#base')
        if (!(l in drawnLines)) drawnLines[l] = new Set()
        for (let i = 0; i < nodes.length - 1; i++) {
            let xykey = [nodes[i], nodes[i + 1]].sort().join('.')
            if (drawnLines[l].has(xykey)) continue

            let x1y1 = nodes[i].split('_');
            let x1 = +(x1y1[0])
            let y1 = +(x1y1[1])

            let x2y2 = nodes[i + 1].split('_');
            let x2 = +(x2y2[0])
            let y2 = +(x2y2[1])

            base.append('line')
                .style("stroke", c)
                .style("stroke-width", depthPadding[l - 1] / 2)
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2);
            drawnLines[l].add(xykey);
        }
    }

    if (p1 == p2) {
        // if parents same, resolve internally   
        let bp = findBestPath(n1out, n2in, p1)
        drawSVGLines(bp, 'yellow', n1s.length)
        return bp
    } else {
        // if diff parents
        let maxCommonLevel = Math.min(n1level, n2level)
        let baseNodes = []
        let commonParent = ''
        for (let lvl = 0; lvl < maxCommonLevel; lvl++) {
            let n1p = n1s.slice(0, lvl).join('.')
            let n2p = n2s.slice(0, lvl).join('.')
            if (n1p != n2p) {
                baseNodes = drawLinks(n1p, n2p)
                break
            } else {
                commonParent = n1p
            }
        }
        if (baseNodes.length > 0) {
            // baseNodes = commonParent.a1 -> commonParent.b1
            // [prepend] commonParent.a1.a2 to baseNodes
            // [append] commonParent.b1.b2 to baseNodes
            let commonPLvl = commonParent.split('.').length
            let prependID = n1s.slice(0, commonPLvl + 1).join('.')
            let appendID = n2s.slice(0, commonPLvl + 1).join('.')
            for (let i = commonPLvl + 2; i <= n1level; i++) {
                let newID = n1s.slice(0, i).join('.')
                let newIDPort = rectPorts[newID][0] // out
                let prependPort = rectPorts[prependID][0]
                if (prependPort != baseNodes[0]) {
                    throw ("Mismatched ports")
                }
                let nodes = findBestPath(newIDPort, prependPort, n1s.slice(0, i - 1).join('.'))
                baseNodes = nodes.slice(0, -1).concat(baseNodes)
                prependID = newID
            }

            for (let i = commonPLvl + 2; i <= n2level; i++) {
                let newID = n2s.slice(0, i).join('.')
                let newIDPort = rectPorts[newID][1] // out
                let appendPort = rectPorts[appendID][1]
                if (appendPort != baseNodes[baseNodes.length - 1]) {
                    throw ("Mismatched ports")
                }
                let nodes = findBestPath(appendPort, newIDPort, n2s.slice(0, i - 1).join('.'))
                baseNodes = baseNodes.slice(0, -1).concat(nodes)
                appendID = newID
            }
            drawSVGLines(baseNodes, 'red', n1s.length)
            return baseNodes
        }

        console.log('diff parents')
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
            links[a] = new Set()
        }
        if (!(b in links)) {
            links[b] = new Set()
        }
        links[a].add(b)
        links[b].add(a)
    }

    function interpolate(a, b, cnt) {
        let v = []
        let interval = (b - a) / (cnt + 1)
        for (let i = 0; i < cnt + 1; i++) v.push(Math.round(a + interval * i))
        v.push(b)
        return v
    }

    let parentPorts = rectPorts[parID]
    let parentPortsPadded = []
    if (parentPorts != undefined) {
        for (let i = 0; i < parentPorts.length; i++) { //map port to children
            let xy = parentPorts[i].split('_').map(x => +(x))
            if (i < xPortCount * 2) {
                xy = i % 2 == 0 ? [xy[0], findSnap(xy[1] + padding, "y")] : [xy[0], findSnap(xy[1] - padding, "y")] //up,down
            } else {
                xy = i % 2 == 0 ? [findSnap(xy[0] - padding, "x"), xy[1]] : [findSnap(xy[0] + padding, "x"), xy[1]] //left,right
            }
            addBidirect(parentPorts[i], xy[0] + "_" + xy[1])
            parentPortsPadded.push([xy[0], xy[1]])
        }
    }

    function checkParentPortsIntercept(x1, x2, y1, y2) {
        if (parentPortsPadded == []) return
        for (let i = 0; i < parentPortsPadded.length; i++) {
            let xy = parentPortsPadded[i]
            if (i < xPortCount * 2) {
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
        let width = +(child.style.width.replace('px', '')) + 2 * padding
        let height = +(child.style.height.replace('px', '')) + 2 * padding

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
    const base = d3.select('#base')
    Object.keys(graph).forEach(x1y1s => {
        //this draws double lines since graph is bidirectional
        x1y1 = x1y1s.split('_');
        let x1 = +(x1y1[0])
        let y1 = +(x1y1[1])
        graph[x1y1s].forEach(x2y2 => {
            x2y2 = x2y2.split('_');
            let x2 = +(x2y2[0])
            let y2 = +(x2y2[1])

            base.append('line')
                .style("stroke", "red")
                .style("stroke-width", padding / 5)
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2);
        })

    })
}