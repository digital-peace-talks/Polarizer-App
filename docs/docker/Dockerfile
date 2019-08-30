FROM debian:unstable-slim

RUN apt-get update
RUN apt-get --no-install-recommends --yes install apt-utils
RUN apt-get --no-install-recommends --yes -m install busybox ssh git mongodb npm make

RUN busybox --install
RUN npm install npm@latest -g
RUN npm install nodemon -g

RUN mkdir /run/sshd
RUN mkdir /root/.ssh
 
COPY authorized_keys /root/.ssh/authorized_keys


WORKDIR /opt
RUN git clone https://github.com/digital-peace-talks/DPT-server.git
WORKDIR /opt/DPT-server

RUN cp .env.example .env

RUN npm install


COPY rcS /

CMD [ "/rcS" ]
