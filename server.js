load('vertx.js');

var config = vertx.config;
var logger = vertx.logger;

var eb = vertx.eventBus;

var rm = new vertx.RouteMatcher();


rm.post('/channels/',function(req) {
	var body = vertx.Buffer();
	req.dataHandler(function(buffer){
		body.appendBuffer(buffer);
	});
	req.endHandler(function(){
		var createChannelMsg = {
			action : "save",
			collection : "channels",
			document : JSON.parse(body.toString())
		};
		eb.send("mongo",createChannelMsg,function(reply) {
			if (reply.status == 'ok') {
				req.response.putHeader('Location',req.uri + reply["_id"]);
				req.response.end("");
			} else {
				req.response.end(reply.message);
			}
		});
	})
});

rm.get('/channels/:id',function(req) {
	logger.info("get channel " + req.params().id);
	var fetchChannelMsg = {
		action : "findone",
		collections : "channels",
		matcher : {"_id" : req.params().id}
	}
	eb.send("mongo",fetchChannelMsg,function(reply) {
		if (reply.status == 'ok') {
			req.end(reply.result);
		} else {
			req.response.end(reply.message);
		}
	});
	req.response.end("{name: 'channel'}");
});


rm.post('/channles/:id/events',function(req){
	req.response.putHeader('Location',req.uri + "123");
	req.response.end("");	
});

rm.get('/channels/:channelId/events/',function(req){
	req.response.end("");
});

rm.get('/channels/:channelId/events/:eventId',function(req){
	req.response.end("");
});


rm.getWithRegEx('.*', function(req) {
  req.response.sendFile("index.html");
});


var mongoServerConf = {
	"address" : "mongo",
    "db_name": "ustream"    
}

vertx.deployModule('vertx.mongo-persistor-v1.0',mongoServerConf);

vertx.createHttpServer().requestHandler(rm).listen(8080, 'localhost');


