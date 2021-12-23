FROM enclavenetworks/jekyll:latest

# set envvar to prevent jekyll --host argument overriding the hostname to 0.0.0.0
ENV JEKYLL_ENV=production

# copy Jekyll website from ./web into the container
COPY src .

# run bundle install and then clear the directory
RUN bundle install && \
    rm -rf $WEB_DIR

ENTRYPOINT ["/usr/local/bin/bundle"]
CMD [ "exec", "jekyll serve --host 0.0.0.0 --port 8080" ]
