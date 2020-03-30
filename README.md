# Digital Peace Talks

## About

Digital Peace Talks is (and always will be) a free and open web app that visualises the quality of interactions between opinions expressed to a given topic.

## Features:

### create random ID

Privacy is protected by a random and encrypted ID.

### create topics

Users can open one topic per day. Topics are visualised within a 3D space.

### publish opinion

Users can publish one opinion per topic. Opinions are visualised within a 3D sub-space

### request 1:1 dialogue

Users that published an opinion to a topic can request a 1:1 dialogue (No Group interaction in DPT) with other users that published their opinion regarding the given topic. Requests are visualised as light brown lines between the two opinions.

### accept or deny 1:1 dialogue

Users can accept or deny requests for dialogue within their dialogue list. A denied request can not be requested a second time. Accepted (active) dialogues are visualised as grey lines between the two opinions.

### lead a 1:1 dialogue

Users can send messages to users that accepted their request.

- We are testing constrains to incentivise constructivnes.
- ATM we are testing to limit the maximum number of messages to incentivise on point argumentation.

### end 1:1 dialogue

Users can permanently end 1:1 dialogues. A pair of users can have a maximum of two dialogues.

### rate 1:1 dialogue

Both users can rate an ended dialogue with negative, neutral or positive. Once both users rated, the results are visualised as follows:

- positive/positive = green line
- positive/neutral = green line
- neutral/neutral = blue line
- neutral/negative = red line
- negative/negative = red line ..between the two opinions.

-->The protocols of rated dialogues are pubslished!

## Live demos

- [sandbox](https://sandbox.dpt.world/) (reset every night)
- [user tests](https://try.digitalpeacetalks.com/) (every second wendesday 8 PM CET)

## Screenshot:

![Alt text](docs/screenshot.png?raw=true "DPT Screenshot")

## Technical stack (brief)

The server implements a RESTful API. It is written in nodejs, using express. The mongo database get accessed via mongoose. The API can be examined via the [swagger api interface](http://dpt.world:2088/). The client uses babylon.js as a webgl render engine.

The way we get a running instance, is, to get a docker container build. Find a Dockerfile and all needed components in the docs/docker directory. The only file you need to update / create is the .env file. There is a .env.example file which works as a template.

For testing, the easiest way to get it up & running:

#### Prerequisite:

- A git client
- A mongo database server
- A node environment
- A recent npm

With this components ready, you can follow these instructions to get it running:

```shell
$ git clone https://github.com/digital-peace-talks/DPT.git
$ cd DPT
$ cp .env.example .env
$ vi .env
$ npm install
$ npm start
```

In .env file you update the absolute path to the directory of the cloned repository and a secret for identifying the session cookie.

#### Note

We believe no one is truely lost. There is no trolls, just humans looking for their needs to be understood.
