module.exports = function stat(req, res, next) {
    var db = req.app.jsweb.db.pg;
    if (req.query.brand && req.query.model) {
	    db.connect(function (err, client, done) {
	        if (err) {
                console.log(err);
                res.status(500).end();
                return;
            };
	        var sql   = ' select cwmake_stat($1, $2); ';
	        var param = [req.query.brand, req.query.model];
            console.log("call %s with %s", sql, JSON.stringify(param));
	        client.query(sql, param, function (err, ret) {
                done();
		        if (err) {
                    console.log(err);
		            res.status(500).end(JSON.stringify(err));
		        } else {
                    var result = {};
                    ret = ret.rows[0].cwmake_stat;
                    for (var key in ret) {
                        result[key + '-version'] = ret[key].version;
                        result[key + '-time']    = ret[key].time;
                        result[key + '-comment'] = ret[key].comment;
                    }
                    res.end(JSON.stringify(result));
		        };
	        });
	    })
    } else {
	    res.status(400).end();
    }
};
