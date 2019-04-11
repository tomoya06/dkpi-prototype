function sleep(mill) {
    let startTime = Date.now()
    while (Date.now() - startTime < mill) {}
}

module.exports = {
    sleep
}