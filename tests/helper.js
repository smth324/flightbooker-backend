const initialPlaces = [
    { name: 'Iloilo (ILO) - Philippines' },
    { name: 'Manila (MNL) - Philippines' },
]

const initialRoutes = [
    {
        originId: 1,
        destinationId: 2,
        price: 1000,
    },
]

const initialPlaneModels = [
    {
        name: 'A380',
        passengerCapacity: 200,
        cargoCapacity: 5000,
    },
]

const initialPlanes = [
    {
        name: 'PR 120',
        modelId: 1,
    },
]

const initialFlights = [
    {
        routeId: 1,
        planeId: 1,
        departureDate: new Date().toISOString(),
        arrivalDate: new Date().toISOString(),
    },
]

module.exports = {
    initialPlaces, initialRoutes, initialPlaneModels, initialPlanes, initialFlights,
}
