exports.randomUint256 = function randomUint256() {
    let r = ""
    for (let i = 0; i < 64; i++) {
        let l = Math.floor(Math.random() * 16)
        if (l < 10) {
            r += l.toString();
        } else {
            r += String.fromCharCode(97 + l - 10);
        }
    }
    return "0x" + r;
}

module.exports