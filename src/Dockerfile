FROM ubuntu:focal

ENV DEBIAN_FRONTEND=noninteractive
ENV WEB_DIR=/home

# set envvar to prevent jekyll --host argument overriding the hostname to 0.0.0.0
ENV JEKYLL_ENV=production

RUN apt-get update
RUN apt-get install -y --no-install-recommends ruby-full npm build-essential zlib1g-dev net-tools iputils-ping iproute2

RUN echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
RUN echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc

WORKDIR $WEB_DIR

RUN npm install
RUN gem install jekyll bundler tzinfo

# copy website into the container
COPY ./ .

# run bundle install and then clear the directory
RUN bundle install && \
    rm -rf $WEB_DIR

#RUN gem install tzinfo -v "~> 1.2"
#RUN gem install wdm -v "~> 0.1.1"

ENTRYPOINT ["/usr/local/bin/bundle"]

CMD [ "exec", "jekyll serve --host 0.0.0.0 --port 8080" ]
