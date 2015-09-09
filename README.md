# Microservice UX for The Lead Developer Workshop

This repository contains the system and components used to illustration the Microservice UX for the Lead Developer workshop.

It assumes a unix like environment. If you are on windows, try booting into an ubuntu VM via vagrant.

## Prerequisites to install

Grab the following tools:
* Docker Compose
* Docker Engine (if on a Mac)

Windows, YMMV. try installing an Ubuntu VM ...

## Boot up a base system

Using Docker Compose

```
docker-compose up
```

This starts up a small set of base componets. 
 * RabbitMQ for event distribution
 * a single node instance of the Photon Event Store
 * A container with a configured Muon CLI.

SSH into the Muon CLI container, which has exposed it's port on 2222.

```
ssh -p 2222 root@localhost
```

The password is ```screencast```


This CLI will be used for much of the event work. Ask why this is.


## Create an event

Using the CLI, create a few new events, in a new event stream.

```
muon event '{"stream-name":"mydata", "payload":{ "type":"ItemShipped", "itemid":"12345" }}'
muon event '{"stream-name":"mydata", "payload":{ "type":"ItemShipped", "itemid":"986" }}'
muon event '{"stream-name":"mydata", "payload":{ "type":"ItemShipped", "itemid":"098" }}'
muon event '{"stream-name":"mydata", "payload":{ "type":"ItemShipped", "itemid":"123" }}'

```

The event will be distributed to the event store, Photon. See the new stream this has created.

```
muon discover --streams
```

Replay the stream

```
muon stream muon://eventstore/stream/mydata?stream-type=hot-cold
```

## Create an inbound adapter

See the ```awsspotprice-inboundadapter``` project

It contains an implementation of an inbound event adapter. Converting from a polling approach on the AWS API to a native event update stream.

It is implemented using :-
 * Bash
 * AWS CLI
 * JQ
 * The Muon CLI

An example of the output is provided in ```awsspotprice-inboundadapter/exampledata.json```

You can run the adapter using your AWS credentials, or alternatively, load a data stream from the example file using

```
cat awsspotprice-inboundadapter/exampledata.json | muon event
```


## Create Projections

The event store supports event projections. These are reduction functions executed across an event range to generate an aggregated data structure that can then be queried.

```
muon command muon://eventstore/projections '{"projection-name" : "product-list",   "stream-name" : "mydata",   "language" : "javascript",  "reduction" : "function(prev,next) { prev.push(next.payload.itemid); return prev; }",  "initial-value" : "[]"}'
```

Query this using 

```
muon query muon://eventstore/projection?projection-name=count-products
```

## Create a view, fronting the projections

A view component is a service that creates an optimised representation data structure. You have many options on how to create these data structures.

See ```spotview``` for an example in nodejs

This can be started with ```npm start```

## Upgrade the view

The event stream is immutable. Projections and other view concerns can be arbitrarily recreated from the stream.

The key point here is that you do not really upgrade like you would a transactional database, you take
advantage of the ability to create multiple eventually consistent view representations.

Logically, you know that one is a more advanced or newer version, but from a data point of view, they are peers.

Update the projection and view to show a subtly different form of data, give them new names.

The handling of the upgrade/ cutover is a gateway or routing concern.

## Create a gateway

Muon takes an event stream oriented view of reality. By applying this view, many benefits appear, however this world view is not the only one and external integration is required.

Converting between an event oriented model and a resourceful or RPC model is the role of a *gateway*.

You can see an exampe gateway in ```gateway```

This converts HTTP GET requests into Muon queries and formats appropriately.

This could be extended to integrate with the reactive streams or emit events.
