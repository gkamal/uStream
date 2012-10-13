
uStream is a platform that enables a website owner to embed widgets that get updated in realtime.

Use cases :

A ticker that needs to be refreshed in real time.
Cricket score updates.
News updates during high visibility events such as budget, earth quakes etc.

Doing this at very large scale (thousands of connected users) is a hard problem. 
uStream handles the delivery of updates.

Most of the current sites use a poll mechanism which is wasteful in terms of bandwidth and processing. 
Also a polling mechanism is hard to scale when the stream is user specific.


Setup an endpoint.

Embeded a widget with the endpoint url in your webpage.
Push events to the endpoint which will then be in realtime pushed to all the users viewing that page.
