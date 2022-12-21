FROM python:3.8


ENV GROUP_ID=1000 USER_ID=1000

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

RUN apt-get update -y && apt-get install -y --no-install-recommends ffmpeg

COPY . /app
WORKDIR /app

RUN addgroup --gid $GROUP_ID www
RUN adduser --uid $USER_ID --gid $GROUP_ID --disabled-password www --shell /bin/sh

USER www

EXPOSE 5000

ENTRYPOINT ["sh","./gunicorn.sh"]
