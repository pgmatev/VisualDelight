var config = {
    host: "mongodb://127.0.0.1",
    port: "27017",
    db: "vd",
    getUrl: function() {
        return this.host + ":" + this.port + "/" + this.db;
    }
};



module.exports = config;

