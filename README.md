>##### All these commands are tested on Ubuntu Version 20.04.3 LTS (Focal Fossa) 
```
├── backend
│   ├── app.js
│   ├── controllers
│   │   ├── login.js
│   │   ├── PostRouter.js
│   │   ├── ReportRouter.js
│   │   ├── SubGredditRouter.js
│   │   └── UserRouter.js
│   ├── db.json
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── index.js
│   ├── models
│   │   ├── Posts.model.js
│   │   ├── Report.model.js
│   │   ├── SubGreddit.model.js
│   │   └── User.model.js
│   ├── package.json
│   ├── package-lock.json
│   ├── uploads
│   └── utils
│       ├── config.js
│       ├── logger.js
│       └── middleware.js
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── README.md
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── assets
│       │   └── icons8-reddit.gif
│       ├── Check_Auth
│       │   └── LocalStorage.js
│       ├── components
│       │   ├── FormElements
│       │   │   ├── Age.js
│       │   │   ├── Email.js
│       │   │   └── Password.js
│       │   ├── Home.js
│       │   ├── Login.js
│       │   ├── MySubGreddits.js
│       │   ├── Navbar.js
│       │   ├── OpenSubGreddits.js
│       │   ├── Profile.js
│       │   ├── Register.js
│       │   ├── SavedPosts.js
│       │   ├── SubGreddits.js
│       │   ├── ViewProfile.js
│       │   └── ViewSubGreddits.js
│       ├── context
│       │   └── AuthContext.js
│       ├── index.css
│       ├── index.js
│       ├── reportWebVitals.js
│       ├── services
│       │   ├── login.js
│       │   ├── Posts.js
│       │   ├── Report.js
│       │   ├── SubGreddiit.js
│       │   └── Users.js
│       └── setupTests.js
├── nginx
│   └── local.conf
└── README.md
```
>* Assumptions
```
1. Member Growth is represented by Number of Accepted Join Requests to a SubGreddit in a cumulative way
2. Due to mismatch b/w IST and GMT , some changes in Stats might not reflect instantaneously
3. Daily Visitors to a SubGreddit are calculated by counting number of Clicks to the Open-Button in SubGreddits page
4. Number of Deleted posts are calculated by subtracting Number of Reports in DB corresponding to SubGreddit from Number of All-time Reports in DB corresponding to SubGreddit
5. Image-Upload is mandatory for creating a New SubGreddit
6. Email Notifications would be sent to valid Emails only
7. At any instant , atmost only one of Ascending,Descending,Followers,Date sort can be active
8. A switch is used to represent Fuzzy Search
9. Some errors are handled in Backend and might not show corresponding messages in Frontend and may be shown through console output
10. Users are not allowed to follow themselves
11. Blocking User based on a Report removes reported user from SubGreddit and permanently bans him from Joining SubGreddit
12. None button is used to undo any sort applied in SubGreddit Page
13. At each place where the User is waiting for the API Call to finish , corresponding Buttons are disabled
14. Reports not handled even after TIME_PERIOD seconds from Time of Report Creation will be Deleted from the DB as soon as any Request involving that Report is Fetched
15. It is assumed that nginx and docker-compose.yml are part of the Outer-most Directory unlike the Submission Format mentioned for Assignment-Part 2 in Assignment.pdf
16. Moderators cannot Block themselves from their SubGreddit
```

>* Guidelines for Dockerization
# Structure

```
.
├── backend
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── ....
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── ....
├── nginx
    └── local.conf
```

# frontend/Dockerfile:

```
FROM node:16-alpine

# ? install node
RUN apk add python3 make g++ 

# ? creat new user (optional)
USER node 

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# ? copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# ? ci is exact install ( without upgraded version )
RUN npm i

# ? first . my PC
# ? second . docker working dir
COPY --chown=node:node . ./

# ? give access to 5000 port of docker
EXPOSE 3000

# RUN chmod +x /bin/sh
# RUN ls -a /bin/
RUN npm run build
CMD npx serve -s build -l 3000
```

# frontend/.dockerignore:

```
node_modules
build
```

# backend/Dockerfile:

```
FROM node:16-alpine

# ? install node
RUN apk add python3 make g++ 

# ? creat new user (optional)
USER node 

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# ? copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# ? ci is exact install ( without upgraded version )
RUN npm i

# ? first . my PC
# ? second . docker working dir
COPY --chown=node:node . ./

# ? give access to 5000 port of docker
EXPOSE 5000

# RUN chmod +x /bin/sh
# RUN ls -a /bin/
CMD npm start
```

# backend/.dockerignore:
```
node_modules
build
```

# nginx/local.conf:

```
worker_processes  1;


events {
    worker_connections  1024;
}

http {

    upstream backend_server {
        server backend:5000;
    }
  
    upstream frontend_server {
        server frontend:3000;
    }
  
    server {
        listen 8080;
        server_name localhost;
        client_max_body_size 8M;
  
        location /api/ {
            proxy_pass http://backend_server;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
  
        location / {
            proxy_pass http://frontend_server;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
  
        location /socket.io/ {
            proxy_pass http://backend_server;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

# docker-compose.yml:

```yaml
version: '3.1'

services:
    backend:
      build: ./backend
      environment:
        - PORT=5000
      restart: unless-stopped
      networks:
        - web-network


    frontend:
      build: ./frontend
      environment:
        - PORT=3000
      networks:
        - web-network
    nginx:
      image: nginx
      container_name: webserver
      restart: unless-stopped
      depends_on:
        - backend
        - frontend
      ports:
        - 8080:8080
      volumes:
        - ./nginx/local.conf:/etc/nginx/nginx.conf
      networks:
        - web-network

networks:
  web-network:
    driver: bridge
```

# How to run:

## Build (To reflect every modification in the Directory from the Previous build , Run after any change in Directory is made (including files)) :

```bash
sudo docker-compose build
```

## Start:

```bash
sudo docker-compose up
```

## Stop:

```bash
sudo docker-compose down
```
