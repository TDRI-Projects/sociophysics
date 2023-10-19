export function cdf(data: number[]): { x: number; y: number }[] {
    const cdf_y: number[] = []
    const cdf_x = [...Array(Math.max(...data) + 1).keys()]
    for (const x_i of cdf_x) {
        cdf_y.push(data.filter(x => x <= x_i).length / data.length)
    }
    
    return []
}