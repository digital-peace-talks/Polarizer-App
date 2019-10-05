# Digital Peace Talks

## About

Digital Peace Talks is (and always will be) a free and open web app that maps opinions via an artificial intelligence and uncovers high quality dialogues. The Digital Peace Talks offer:

You can open or join a discussion for any question that is on your mind. Anyone can give one single answer and, with that, express their opinion on the topic. Every user acts anonymously, protected by a random and encrypted ID.

Yes, anonymity bring forth the depths of the human soul.That is the reason why Digital Peace Talks distinguish strictly between the expression of opinion of a person and the exchange of opinion between two people.

You can ask any person that has published an opinion to a personal one-on-one dialogue.

At the end of the dialogue you can rate the exchange. The dialogue is marked as a line between your opinions on a 3D map. the line's color indicates the course that the dialogue took.

You can see who stirs things up, who is hurtful and who manages to build bridges.

Every dialogue is published. The result is a three-dimensional space, where every opinion belonging to a question is visible.

Now you can filter all the opinions and dialogues, for example by only showing the dialogues that are rated positively or negatively. That way you can see where bridges between camps have already been built and where they haven't.

You can also set criteria for the kind of offers you get for one-on-one dialogues.

Find more details on our [homepage](https://www.digitalpeacetalks.com). To see Digital Peace Talks in action, you can try it out at our self-cleaning [sandbox](https://sandbox.dpt.world/).

## Technical status (brief)

We are in an early alpha release mode now. There is no machine learning component yet. The 3D world has still a flat look. This means, that all components (topics, opinions and edges) are arranged on a x-y plane.

The server implements a RESTful API. It is written in nodejs, using express. The mongo database get accessed via mongoose.The API can be examined via the [swagger api interface](http://dpt.world:2088/). The client uses babylon.js as a webgl render engine.

The way we get a running instance, is, to get a docker container build. Find a Dockerfile and all needed components in the docs/docker directory. The only file you need to update / create is the .env file. There is a .env.example file which works as a template.

For testing, the easiest way to get it up & running:

#### Prerequist:

   * A git client
   * A mongo database server
   * A node environment
   * A recent npm

With this components ready, you can follow these instructions to get it running:

```shell
$ git clone https://github.com/digital-peace-talks/DPT-server.git
$ cd DPT-server
$ cp .env.example .env
$ vi .env
$ npm install
$ node src/bin/www
```
In .env file you update the absolut path to the directory of the cloned repository and a secret for identifying the session cookie.

#### Note

Please keep in mind: This project is under developement and is far from major or done. Things can change dramaticaly. Everytime. It's up to the user community to influence the way we go. And keep in mind: this is just a tool, not the solution to get conflicts solved.

Feel free to try it out at our [sandbox](https://sandbox.dpt.world/). There is still a lot to do, if you have suggestions or patches or like to join the active dev team, get in contact. Please use this github to report any feedback.

Thank you.
