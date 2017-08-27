function quoteObj(name, quote, id) {
    this.name = name;
    this.quote = quote;
    this.like = 0;
    this.sessionID = id;
}

module.exports = quoteObj;