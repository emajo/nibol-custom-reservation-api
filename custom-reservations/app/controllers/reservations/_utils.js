exports.alreadyExist = (reservations, date) => !!reservations?.find(reservation => reservation.date === date)

exports.getResponseDate = (response) => response?.start.split('T')[0]

exports.getResponseReservation = (response) => ({
  start: response.start,
  end: response.end,
  space: response.space.name,
})
