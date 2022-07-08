const calculateSeatsLeftMarkup = (numberOfVacant, capacity) => {
    const percentLeft = 100 - numberOfVacant / capacity
    let markup = 0
    if (percentLeft < 10) {
        markup = 0.30
    } else if (percentLeft < 30) {
        markup = 0.20
    } else if (percentLeft < 50) {
        markup = 0.10
    }
    return markup
}

const calculateFlightPayment = (flights, cabinClass) => {
    let markup = 0
    switch (cabinClass) {
    case 'Economy':
        markup = 0
        break

    case 'Premium Economy':
        markup = 0.20
        break
    case 'Business':
        markup = 0.50
        break
    default:
        markup = 0
    }
    const asd = flights.map((x) => ({
        ...JSON.parse(JSON.stringify(x)),
        price: x.route.price
        * (1 + calculateSeatsLeftMarkup(x.vacant, x.plane.model.passengerCapacity))
        * (1 + markup),
    }))
    return asd
}

const calculateBookingPayment = (price, numberOfPeople, promotionPercent) => (
    price * numberOfPeople * (1 - promotionPercent / 100)
)

module.exports = { calculateFlightPayment, calculateBookingPayment }
