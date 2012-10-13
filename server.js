load('vertx.js');

var config = vertx.config;
var logger = vertx.logger;

var eb = vertx.eventBus;

var httpServer = vertx.createHttpServer()

var rm = new vertx.RouteMatcher();

httpServer.requestHandler(rm);

vertx.createSockJSServer(httpServer).bridge({prefix: "/eventbus"}, [{}], [{}]);

httpServer.listen(8080, 'localhost');


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
		collection : "channels",
		matcher : {"_id" : req.params().id}
	}
	eb.send("mongo",fetchChannelMsg,function(reply) {
		if (reply.status == 'ok') {
			req.response.end(JSON.stringify(reply.result));
		} else {
			req.response.end(reply.message);
		}
	});
});


rm.post('/channels/:channelId/events/',function(req){
	var body = vertx.Buffer();
	req.dataHandler(function(buffer){
		body.appendBuffer(buffer);
	});
	
	req.endHandler(function(){
		var event = JSON.parse(body.toString());
		event.channelId = req.params().channelId;
		event.timeStamp = new Date();
		eb.send(req.params().channelId,event);
		var createEventMsg = {
			action : "save",
			collection : "events",
			document : event
		};
		eb.send("mongo",createEventMsg,function(reply) {
			if (reply.status == 'ok') {
				req.response.putHeader('Location',req.uri + reply["_id"]);
				req.response.end("");
			} else {
				req.response.end(reply.message);
			}
		});
	});
});

rm.get('/channels/:channelId/events/',function(req){
	var fetchEventsForChannelMsg = {
		action : "find",
		collection : "events",
		matcher : {"channelId" : req.params().channelId},
		sort : {timeStamp : -1},
		limit : 5
	}
	eb.send("mongo",fetchEventsForChannelMsg,function(reply) {
		if (reply.status == 'ok') {
			req.response.end(JSON.stringify(reply.results));
		} else {
			req.response.end(reply.message);
		}
	});
});

rm.get('/channels/:channelId/events/:eventId',function(req){
	logger.info("get event " + req.params().eventId);
	var fetchEventMsg = {
		action : "findone",
		collection : "events",
		matcher : {"_id" : req.params().eventId}
	}
	eb.send("mongo",fetchEventMsg,function(reply) {
		if (reply.status == 'ok') {
			req.response.end(JSON.stringify(reply.result));
		} else {
			req.response.end(reply.message);
		}
	});
});

rm.getWithRegEx('.*', function(req) {
   var file = '';
  if (req.path == '/') {
    file = 'index.html';
  } else if (req.path.indexOf('..') == -1) {
    file = req.path;
  }
  var fileLoc = 'web/' + file;
  req.response.sendFile(fileLoc);   
});


var mongoServerConf = {
	"address" : "mongo",
    "db_name": "ustream"    
}

vertx.deployModule('vertx.mongo-persistor-v1.0',mongoServerConf);



