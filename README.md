# FLOW-D a GDPR data flow mapping tool

A simple tool for mapping the data flows of your organization

## Setup and run

### Without docker:

Install Neo4j and nodejs to your machine. Afterwards follow theese steps:

1. first clone the repo:

```
git clone https://github.com/pc-magas/data-mapper
```

2. Export the enviromental varaibles as seen bellow on GNU/Linux or similar (eg. macos) using `export` command

3. Run `npm start`


### With docker:

There are 2 approaches when using docker:

1. Buidling and running the docker container in your lockal machine.
2. Using docker image from the dockerhub registry.

#### 1. Buidling and running the docker container in your local machine.

Jun theese commands:

```
git clone https://github.com/pc-magas/data-mapper
docker-compose build --no-cache --force-rm
docker-compose up
```

Then over your browser visit http://0.0.0.0:9781 for the development container and http://0.0.0.0:9780 for the production ready one.

#### 2. Using docker image from the dockerhub registry.

Currently is not uploaded into any registry due to missing parts.


## Enviromental Variables:

The application's configuration and the containers id defined using the enviromental variables as the followng tavble shows:

Variable Name | Description | Optional | Used In Docker | Default Value* | Dockerfile for image `pcmagas/data-map` default value** | Dockerfile for image `pcmagas/data-map:dev` default value** | Currenty Supported-Used |
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
HTTP_PORT | The port that the application will listen into | :heavy_check_mark: | :heavy_check_mark: | 9780  | 9780 | 9781 | :heavy_check_mark:
CLIENT_SOCKETIO_URL | The url of socketio websocket that the website will listen into | :heavy_check_mark: | :heavy_check_mark: | `ws://0.0.0.0:^http_port^` (where `^http_port^` is the port defined above) | N/A | N/A | :heavy_check_mark: |
NEO4J_HOST | The neo4j host server | :x: | :heavy_check_mark: | N/A | N/A | N/A | :heavy_check_mark:
NEO4J_USER | The neo4j username used in order to connect into neo4j server | :x: | :heavy_check_mark: | N/A | N/A | N/A | :heavy_check_mark: |
NEO4J_PASSWORD | The neo4j password used in order to connect into neo4j server | :x: | :heavy_check_mark: | N/A | N/A | N/A | :heavy_check_mark: |
LOGS_DIR | Directory that keeps the logs files | :heavy_check_mark: | :heavy_check_mark: | N/A | /var/log/data_map | /var/log/data_map | :heavy_check_mark: |
MONGO_CONNECTION_STRING | Connection for mongodb used in user authentication |  :heavy_check_mark: |  :heavy_check_mark: | mongodb://localhost/mydb | N/A | N/A | :x: |

\* If you run locally the containers using the repo provided `docker-compose.yml` then the values may vary please check the `docker-compose.yml` and in order to have a look what are theese options
** If no value specified then us used the one provided from application's auto configuration.

## Docker containers:

If you built using the docker-compose.yml theese 2 containe4rs will get generated:

* `pcmagas/data-map` The default data mapper.
* `pcmagas/data-map:dev` The container used for development reasons.

The `pcmagas/data-map` exposes the following directories as volumes:

* `/var/log/data_map` where is the directory whenre the logs are being kept.

The `pcmagas/data-map:dev` exposes these volumes:

* `/opt/map` Where is located the application's source code. Please use it in order to run the application.
* `/var/log/data_map` where is the directory whenre the logs are being kept.

Also the image use the dollowing ports for communication when running over a container:

Image Name | Port in dockerfile | Port mapped in repo provided `docker-compose.yml`
--- | --- | ---
`pcmagas/data-map` | 9780 | 9780
`pcmagas/data-map:dev` | 9781 | 9781

# Licence:

    FLOW-D a GDPR data flow mapping tool
    Copyright (C) 2018 Desyllas Dimitrios

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
