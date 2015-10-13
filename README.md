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

####build images
```
docker build -t hnybom/mongodb mongod
docker build -t hnybom/mongos mongos
```


####Create mongo servers
```
docker run -P --name rs1_srv1 -d hnybom/mongodb --replSet rs1 --noprealloc --smallfiles
docker run -P --name rs1_srv2 -d hnybom/mongodb --replSet rs1 --noprealloc --smallfiles
docker run -P --name rs1_srv3 -d hnybom/mongodb --replSet rs1 --noprealloc --smallfiles
```
####Get ips
```
docker inspect rs1_srv1 | grep IPAddress
172.17.0.4
docker inspect rs1_srv2 | grep IPAddress
172.17.0.5
docker inspect rs1_srv3 | grep IPAddress
172.17.0.6
```

mongo --port <port of srv1>

MongoDB shell

```
rs.initiate()
rs.add("172.17.0.5:27017")
rs.add("172.17.0.6:27017")
rs.status()

cfg = rs.conf()
cfg.members[0].host = "172.17.0.4:27017"
rs.reconfig(cfg)
rs.status()
```

## Optional shard config

####Create mongo config servers

```
docker run -P --name cfg1 -d hnybom/mongodb --noprealloc --smallfiles --configsvr --dbpath /data/db --port 27017
docker run -P --name cfg2 -d hnybom/mongodb --noprealloc --smallfiles --configsvr --dbpath /data/db --port 27017
docker run -P --name cfg3 -d hnybom/mongodb --noprealloc --smallfiles --configsvr --dbpath /data/db --port 27017
```

####Get server ips
```
docker inspect cfg1 | grep IPAddress
172.17.0.7
docker inspect cfg2 | grep IPAddress
172.17.0.8
docker inspect cfg3 | grep IPAddress
172.17.0.9
```

####Create mongo router
```
docker run -P --name mongos1 -d hnybom/mongos --port 27017 --configdb 172.17.0.7:27017,172.17.0.8:27017,172.17.0.9:27017
```

IP: 172.17.0.10:27017

```
sh.addShard("rs1/172.17.0.4:27017")
sh.status()
```

##User config and server start

####Create mongo users

```
use admin

db.createUser(
  {
    user: "siteUserAdmin",
    pwd: "password",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)

use levyraati

db.createUser(
  {
    user: "recordsUserAdmin",
    pwd: "password",
    roles: [ { role: "userAdmin", db: "levyraati" } ]
  }
)


db.createUser(
    {
      user: "levyraati",
      pwd: "password",
      roles: [
         { role: "readWrite", db: "levyraati" }
      ]
    }
)
```
####Create user for opLogging

```
mongo -u siteUserAdmin -p password localhost:<srv1_port>/admin

db.createUser(
    {
      user: "opLogged",
      pwd: "password",
      roles: [
         { role: "read", db: "local" }
      ]
    }
)

```
####Run app
```
docker run -d -e ROOT_URL=http://46.101.210.33 -e MONGO_URL=mongodb://levyraati:password@172.17.0.4:27017/levyraati -e MONGO_OPLOG_URL=mongodb://opLogged:password@172.17.0.4:27017,172.17.0.5:27017,172.17.0.6:27017/local?authSource=admin -v /root/levyraati_install:/bundle -p 8080:80 meteorhacks/meteord:base
```
