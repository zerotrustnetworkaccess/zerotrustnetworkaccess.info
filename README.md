-# zerotrustnetworkaccess.info

How to start

1. Install Gems
   bundle install

2. Run project
   bundle exec jekyll serve

Or use run.sh script at root folder.

Project created from theme https://themeforest.net/item/snowlake-creative-business-startup-jekyll-template/29345272
Theme based on bootstrap and some jquery libraries for header, sliders and filtering items. All this frameworks and libs are ruduced by theme authors to fit only several theme features.

Styling
Project based on bootstrap and custom theme styles which are complemented with ZTNA colors, typography, interface elements and spaces.

Layout and margins mostly came from bootstrap

features
custom timeline
subscription

includes
A folder were Jekyll stores the reuseble code. Like components in React. So the structure is:
components – small reuseble part all over the site
modules - more complicated reusable components, like footer or popup
landing, post, blog – components for particular pages.

How to use bloquoutes.
author=page.qoute.author
author_photo=page.qoute.author_photo
occupation=page.qoute.occupation
blockquote=page.qoute.blockquote

For example:
{% include post/bloquote.html author=page.qoute.author occupation=page.qoute.occupation blockquote=page.qoute.blockquote author_photo=page.qoute.author_photo%}

-
