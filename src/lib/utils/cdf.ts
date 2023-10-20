export function cdf(data: number[]): { x: number; y: number }[] {
    const cdf: { x: number; y: number }[] = []
    for (let i = 0; i < 300; i++) {
        cdf.push({
            x: i,
            y: data.filter(x => x <= i).length / data.length
        })
    }
    
    return cdf
}