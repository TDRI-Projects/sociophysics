export function logbin(data: number[], scale: number = 1, zeroes = false): { x: number; y: number }[] {
    const total = data.length
    const s_max = Math.max(...data)
    const count = Array(s_max + 1).fill(0)
    for (const s of data) {
        count[s]++
    }

    let x: number[]
    let y: number[]
    if (scale > 1) {
        const j_max = Math.ceil(Math.log(s_max) / Math.log(scale))
        if (j_max < 1) {
            return []
        }

        let bin_edges: number[]
        if (zeroes) {
            bin_edges = [...Array(j_max).keys()].map(j => Math.pow(scale, j))
            bin_edges[0] = 0
        } else {
            bin_edges = [...Array(j_max - 1).keys()].map(j => Math.pow(scale, j + 1))
        }
        bin_edges = [...new Set(bin_edges.map(x => Math.round(x)))]

        x = [...Array(bin_edges.length - 1).keys()].map(i => Math.pow(bin_edges[i] * (bin_edges[i + 1] - 1), 0.5))
        y = [...Array(bin_edges.length - 1).keys()].map(i => count.map(x => x / (bin_edges[i + 1] - bin_edges[i])).slice(bin_edges[i], bin_edges[i + 1]).reduce((a, b) => a + b, 0))
    }

    else {
        x = [...count.keys()].filter(i => count[i] != 0)
        y = count.filter(x => x != 0)
        if (!zeroes && x[0] == 0) {
            x.shift()
            y.shift()
        }
    }

    y = y.map(y => y / total)
    const non_zeroes_indices = y.findIndex(y => y != 0)
    if (non_zeroes_indices != -1) {
        x = x.slice(non_zeroes_indices)
        y = y.slice(non_zeroes_indices)
    }

    return x.map((x, i) => ({
        x,
        y: y[i]
    }))
}