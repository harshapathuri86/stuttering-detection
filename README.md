## Development


### Database setup

Using docker based mongodb for ease of setup and deployment.

```bash
docker-compose run --service-ports -d mongodb
```

### Server

```bash
cd server
# create a virtual environment
python3 -m venv venv
# activate the virtual environment
# for bash and zsh
source venv/bin/activate
# for fish
# source venv/bin/activate.fish
# install dependencies
pip install -r requirements.txt
# run the server
flask run
```
Note: Run `flask run` again when made changes to the server.

## Add questions and passages into the database.**
This is done only once. (Requires httpie package)
Can also be done using postman.

```bash
chmod +x add_data.sh
./add_data.sh
```
### Fastapi
```bash
pip install fastapi uvicorn python-multipart scipy python_-speech_features keras tensorflow
./start.sh
```

### Client

Use **[nvm](https://github.com/nvm-sh/nvm)** to install node lts version.


```bash
cd client
# install dependencies
yarn install
# start the client
yarn start
```
