FROM postgres:14.6

# Install PL/py extension
RUN apt-get update && \
    apt-get -y install \
    postgresql-plpython3-14
