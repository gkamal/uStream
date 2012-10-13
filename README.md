
uStream is a platform that enables a website owner to embed widgets that get updated in realtime.

##Use cases :##

<ul>
<li>A ticker that needs to be refreshed in real time.</li>
<li>Cricket score updates.</li>
<li>News updates during high visibility events such as budget, earth quakes etc.</li>
</ul>

Doing this at **very large scale** (thousands of connected users) is a hard problem. 
uStream handles reliable delivery of updates.

Most of the current sites use a poll mechanism which is wasteful in terms of bandwidth and processing. 
Also a polling mechanism is hard to scale when the stream is user specific.


##How to use##

<ol>
	<li>Create a new Channel</li>	
	<li>Choose the type of widget (ticker, highlights ..)</li>
	<li>Copy the embed code to your HTML page</li>
	<li>Publish the initial data</li>
	<li>Publish updates</li>
</ol>