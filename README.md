# levyraati

Song voting app

# Docker installation instructions

####hnybom/mongod

```
FROM ubuntu:latest

Add 10gen official apt source to the sources list
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/10gen.list

Install MongoDB
RUN apt-get update
RUN apt-get install -y mongodb-org

Create the MongoDB data directory
RUN mkdir -p /data/db

EXPOSE 27017
ENTRYPOINT ["usr/bin/mongod"]
```

####hnybom/mongos

```
FROM hnybom/mongodb:latest

EXPOSE 27017
ENTRYPOINT ["usr/bin/mongos"]
```

####create mongo servers
```
docker run -P --name rs1_srv1 -d hnybom/mongodb --replSet rs1 --noprealloc --smallfiles
docker run -P --name rs1_srv2 -d hnybom/mongodb --replSet rs1 --noprealloc --smallfiles
docker run -P --name rs1_srv3 -d hnybom/mongodb --replSet rs1 --noprealloc --smallfiles
```

docker inspect rs1_srv1
172.17.0.12
docker inspect rs1_srv2
172.17.0.13
docker inspect rs1_srv3
172.17.0.14

mongo --port <port of srv1>

MongoDB shell

```
rs.initiate()
rs.add("172.17.0.13:27017")
rs.add("172.17.0.14:27017")
rs.status()

cfg = rs.conf()
cfg.members[0].host = "172.17.0.12:27017"
rs.reconfig(cfg)
rs.status()
```

####create mongo config servers

```
docker run -P --name cfg1 -d hnybom/mongodb --noprealloc --smallfiles --configsvr --dbpath /data/db --port 27017
docker run -P --name cfg2 -d hnybom/mongodb --noprealloc --smallfiles --configsvr --dbpath /data/db --port 27017
docker run -P --name cfg3 -d hnybom/mongodb --noprealloc --smallfiles --configsvr --dbpath /data/db --port 27017
```

docker inspect cfg1
172.17.0.15
docker inspect cfg2
172.17.0.16
docker inspect cfg3
172.17.0.17

####create mongo router
```
docker run -P --name mongos1 -d hnybom/mongos --port 27017 --configdb 172.17.0.15:27017,172.17.0.16:27017,172.17.0.17:27017
```

IP: 172.17.0.20:27017

db.createUser(
    {
      user: "levyraati",
      pwd: "pass",
      roles: [
         { role: "readWrite", db: "levyraati" },
         { role: "read", db: "local" }
      ]
    }
)

Mongo 2.4 -->

db.addUser(
    {
      user: "levyraati",
      pwd: "pass",
      roles: ["readWrite"]
    }
)

#### run app
```
docker run -d -e ROOT_URL=http://46.101.210.33 -e MONGO_URL=mongodb://levyraati:pass@172.17.0.20:27017/levyraati -e MONGO_OPLOG_URL=mongodb://levyraati:pass@172.17.0.12:27017/local -v /root/levyraati_install:/bundle -p 8080:80 meteorhacks/meteord:base
```
