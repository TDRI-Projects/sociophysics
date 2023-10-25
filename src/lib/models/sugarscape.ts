function distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
}

function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
}

class Cell {
    readonly i: number
    readonly j: number
    sugar: number
    readonly max_sugar: number

    constructor(i: number, j: number) {
        this.i = i
        this.j = j

        const l = Math.min(distance(i, j, 15, 15), distance(i, j, 35, 35))
        if (l >= 21) {
            this.max_sugar = 0
        } else if (l >= 16) {
            this.max_sugar = 1
        } else if (l >= 11) {
            this.max_sugar = 2
        } else if (l >= 6) {
            this.max_sugar = 3
        } else {
            this.max_sugar = 4
        }
        this.sugar = this.max_sugar
    }

    grow() {
        this.sugar = Math.min(this.sugar + 1, this.max_sugar)
    }
}

interface AgentAttributes {
    sugar_min: number
    sugar_max: number
    metabolism_min: number
    metabolism_max: number
    vision_min: number
    vision_max: number
    lifespan_min: number
    lifespan_max: number
}

class Agent {
    i: number
    j: number
    sugar: number
    readonly metabolism: number
    readonly vision: number
    lifespan: number

    constructor(i: number, j: number, agent_attributes: AgentAttributes) {
        this.i = i
        this.j = j
        // Between 5 and 25
        this.sugar = agent_attributes.sugar_min + Math.round(Math.random() * (agent_attributes.sugar_max - agent_attributes.sugar_min))
        // Between 1 and 4
        this.metabolism = agent_attributes.metabolism_min + Math.round(Math.random() * (agent_attributes.metabolism_max - agent_attributes.metabolism_min))
        // Between 1 and 6
        this.vision = agent_attributes.vision_min + Math.round(Math.random() * (agent_attributes.vision_max - agent_attributes.vision_min))
        // Between 60 and 100
        this.lifespan = agent_attributes.lifespan_min + Math.round(Math.random() * (agent_attributes.lifespan_max - agent_attributes.lifespan_min))
    }

    move(cells: Cell[][], agent_locations: number[][]) {
        let max_sugar = 0
        let min_distance = 10000
        let max_sugar_locations: number[][] = []
        for (let i = this.i - this.vision; i <= this.i + this.vision; i++) {
            for (let j = this.j - this.vision; j <= this.j + this.vision; j++) {
                if (i >= 0 && i < 50 && j >= 0 && j < 50 && !agent_locations.includes([i, j])) {
                    if (cells[j][i].sugar > max_sugar) {
                        max_sugar = cells[j][i].sugar
                        max_sugar_locations = [[i, j]]
                        min_distance = distance(i, j, this.i, this.j)
                    }
                    if (cells[j][i].sugar === max_sugar) {
                        const d = distance(i, j, this.i, this.j)
                        // max_sugar_locations.push([i, j])
                        if (d < min_distance) {
                            max_sugar_locations = [[i, j]]
                            min_distance = d
                        } else if (d === min_distance) {
                            max_sugar_locations.push([i, j])
                        }
                    }
                }
            }
        }

        shuffleArray(max_sugar_locations)
        this.i = max_sugar_locations[0][0]
        this.j = max_sugar_locations[0][1]
        this.sugar += cells[this.j][this.i].sugar
        cells[this.j][this.i].sugar = 0
        this.sugar -= this.metabolism
        this.lifespan -= 1
        return this.lifespan == 0 || this.sugar < 0
    }
}

export class Sugarscape {
    readonly cells: Cell[][] = []
    agents: Agent[] = []
    agent_attributes: AgentAttributes
    N: number

    get_agent_locations() {
        return this.agents.map(agent => [agent.i, agent.j])
    }

    add_agent() {
        const agent_locations = this.get_agent_locations()
        while (this.agents.length < this.N) {
            const i = Math.floor(Math.random() * 50)
            const j = Math.floor(Math.random() * 50)
            if (!agent_locations.find(([x, y]) => x === i && y === j)) {
                this.agents.push(new Agent(i, j, this.agent_attributes))
                agent_locations.push([i, j])
            }
        }
    }

    constructor(agent_attributes: AgentAttributes, N: number) {
        this.cells = Array(50).fill(0).map((_, j) => Array(50).fill(0).map((_, i) => new Cell(i, j)))
        this.agent_attributes = agent_attributes
        this.N = N
        this.add_agent()
    }

    iterate() {
        shuffleArray(this.agents)
        for (const agent of this.agents) {
            const is_dead = agent.move(this.cells, this.get_agent_locations())
            if (is_dead) {
                this.agents = this.agents.filter(a => a !== agent)
            }
        }

        for (const row of this.cells) {
            for (const cell of row) {
                cell.grow()
            }
        }

        this.add_agent()
    }

    get_agent_sugar() {
        return this.agents.map(agent => agent.sugar)
    }

    update_agent_attributes(agent_attributes: AgentAttributes) {
        this.agent_attributes = agent_attributes
    }

    update_N(N: number) {
        this.N = N
    }
}