let data = generateData(4, 7); // 6,10
let links = generateLinks(data);
let connectedLinks = {}
let rectPorts = {}
let connectivityGraphs = {}
let drawn = new Set();
let minSize = 2

function generateData(maxDepth, maxChildren) {
    let count = 0

    function boo(n, d) {
        count += 1
        return {
            "n": n,
            "v": 1,
            "c": []
        }
    }

    let r = boo('1', 0)

    function foo(rr, n, d) {
        if (d > maxDepth) {
            return
        }
        for (i = 0; i < maxChildren; i++) {
            if (Math.random() > 0.5) {
                let cc = boo(n + "." + i, d + 1)
                rr["c"].push(cc)
            }
        }
        rr["c"].forEach(c => {
            foo(c, c.n, d + 1)
        })
    }
    foo(r, '1', 0)
    console.log(count + " objs generated")
    return r;
}

function generateLinks(data) {
    // flattened to separate processing dependencies at different levels
    let links = {};
    let stack = [
        [data['c'], data['c']]
    ];
    let c = 0;

    function updateLink(n1, n2) { //src,dst
        function boo(nn1, nn2, d) {
            if (!(nn1 in links)) {
                links[nn1] = {}
            }
            links[nn1][nn2] = d //direction
            c += 1
        }
        boo(n1, n2, 1)
        boo(n2, n1, 0)
    }

    function foo(src, dst) {
        for (i = 0; i < src.length; i++) {
            for (j = 0; j < dst.length; j++) {
                if (Math.random() > 0.7) {
                    let s1 = src[i];
                    let d1 = dst[j];
                    if (s1.n != d1.n) {
                        updateLink(s1.n, d1.n)
                        if (Math.random() > 0.5) {
                            stack.push([s1.c, dst])
                        } else if (Math.random() > 0.5) {
                            stack.push([src, d1.c])
                        } else {
                            stack.push([s1.c, d1.c])
                        }
                    }
                }
            }
        }
    }
    while (stack.length > 0) {
        let d = stack.pop();
        foo(d[0], d[1])
    }
    console.log(c + " links added.")
    return links;
}


function clone(o, dep) {
    let o1 = {};
    Object.keys(o).forEach(k => {
        if (k != 'c') {
            o1[k] = o[k]
        }
    })
    o1.d = dep
    return o1;
}

function drawTreemap(d1, depth) {
    let ifBreak = false
    if (d1.children.length == 0) return true
    let oid = "#" + d1["n"];
    oid = oid.replace(/\./g, '\\.')
    let o = $(oid)[0];

    let gid = "#g-" + d1["n"];
    gid = gid.replace(/\./g, '\\.')
    let g = $(gid)[0];

    let width = +(o.getAttribute("width"))
    let height = +(o.getAttribute("height"));
    let padding = width / 30 + depth;
    d1.v = 0;
    treemap = (d1) =>
        d3
        .treemap()
        .tile(d3.treemapSquarify.ratio(1.1))
        .size([width, height])
        .paddingOuter(padding)
        .paddingInner(padding)
        .round(true)(d3.hierarchy(d1).sum(d => d.v));
    const treemapd = treemap(d1);

    let dataGrp = d3.group(treemapd, (d) => d.depth);
    dataGrp.delete(0);

    let xoffset = g == undefined ? 0 : +(g.getAttribute('x'));
    let yoffset = g == undefined ? 0 : +(g.getAttribute('y'));

    dataGrp.forEach(x => {
        x.forEach(d => {
            if ((d.x1 - d.x0) < minSize || (d.y1 - d.y0) < minSize) {
                ifBreak = true
            } else {
                let g = d3.select("svg").append('g');
                g.attr("transform", `translate(${xoffset+d.x0},${yoffset+d.y0})`)
                    .attr("x", xoffset + d.x0) //does nothing, for easier ref
                    .attr("y", yoffset + d.y0) //does nothing, for easier ref
                    .attr("class", "p" + d1.n)
                    .attr("id", "g-" + d.data.n);
                g.append("rect")
                    .attr("fill", color(d.data.d))
                    .attr("width", d.x1 - d.x0)
                    .attr("height", d.y1 - d.y0)
                    .attr("id", d.data.n);
                drawn.add(d.data.n)
            }
        })
    });

    let graph = calculateConnectivity(d1.n, padding);
    connectivityGraphs[d1.n] = graph;
    //debugDrawConnectivity(graph, padding)

    // draw links whichever renders last
    d1.children.forEach(x => {
        if (x.n in links) {
            let dsts = links[x.n];
            Object.keys(dsts).forEach(d => {
                if (drawn.has(d)) {
                    drawLinks(x.n, d)
                        //setTimeout(() => { drawLinks(x.n, d) }, 0)
                }
            })
        }
    })
    return ifBreak
}



function createHierarchicalTreemap(d1, depth) {
    //breadth first
    if (!depth) {
        depth = 1
    }
    let wstack = [];
    let d1c = clone(d1);
    d1c['children'] = [];
    d1["c"].forEach(d => {
        d1c['children'].push(clone(d, depth));
        if (d["c"]) {
            wstack.push(d);
        }
    })
    if (!drawTreemap(d1c, depth)) {
        wstack.forEach(w => {
            setTimeout(() => {
                createHierarchicalTreemap(w, depth + 1)
            }, 0)
        })
    }
}