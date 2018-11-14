import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'

interface Employee {
    name: string
    surname: string
    position: string
}

interface EventData {
    name: string
    surname: string
    position: string
}

export default async (event: FunctionEvent<EventData>) => {
    try {
        const graphcool = fromEvent(event)
        const api = graphcool.api('simple/v1')

        const { name, surname, position } = event.data

        let date = new Date()

        const employee = await createEmployee(api, name, surname, position)

        return { data: employee}

    } catch {
        return { error: "Fatal error, unnable to add a new employee. You suck!" }
    }
}

async function createEmployee(api: GraphQLClient, name: string, surname: string, position: string) : Promise<Employee> {
    const mutation = `
        mutation createEmployees($name: String, $surname: String, $position: String) {
            createEmployees(
                name: $name
                surname: $surname
                position: $position
            ) {
                name
                surname
                position
            }
        }
    `

    const variables = {
        name,
        surname,
        position
    }

    return api.request<{ createEmployees: Employee }>(mutation, variables)
        .then(r => r.createEmployees)
}

