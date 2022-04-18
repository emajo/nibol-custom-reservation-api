module.exports = function getLaunchEndTime(launchStartTime) {

    switch (launchStartTime) {
        case '12:30':
            return '13:00'
        case '13:00':
            return '13:30'
        case '13:30':
            return '14:00'
    }

}