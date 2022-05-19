
FROM python:3.8

LABEL MAINTAINER="Harsha Pathuri <harsha.pathuri@students.iiit.ac.in>"

ENV GROUP_ID=1000 USER_ID=1000

COPY requirements.txt /
RUN pip3 install --no-cache-dir -r /requirements.txt

COPY . /app
WORKDIR /app

RUN addgroup --gid $GROUP_ID www
RUN adduser --uid $USER_ID --gid $GROUP_ID --disabled-password www --shell /bin/sh

USER www

EXPOSE 5000

ENTRYPOINT ["sh","./gunicorn.sh"]
