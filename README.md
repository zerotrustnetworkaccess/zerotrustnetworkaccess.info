-# zerotrustnetworkaccess.info

How to start

1. Install Gems
   bundle install

2. Run project
   bundle exec jekyll serve

Or use run.sh script at root folder.

Project created from theme https://themeforest.net/item/snowlake-creative-business-startup-jekyll-template/29345272
Theme based on bootstrap and some jquery libraries for header, sliders and filtering items. All this frameworks and libs are reduced by theme authors to fit only several theme features.

Styling
Project based on

1. bootstrap
2. custom theme styles
3. ZTNA colors, typography, interface elements and spacing.

Layout and some spacing came from bootstrap
Header, sliders and filtering items came from theme and some custom styles.
Other elements are ZTNA custom solution.

All custom styles located in \_sass folder. In \_sass root are common styles and in subfolders situated particular styles.

In html code you can distinguish styles by name:
bootstrap names are kept original
custom ztna styles came with ztna-prefix
all other styles came from theme.

features
custom timeline
subscription

includes
A folder were Jekyll stores the reuseble code. Like components in React. So the structure is:
components – small reuseble part all over the site
modules - more complicated reusable components, like footer or popup
landing, post, blog – components for particular pages.

CSS has the same structure. A

How to use bloquoutes.
author=page.qoute.author
author_photo=page.qoute.author_photo
occupation=page.qoute.occupation
blockquote=page.qoute.blockquote

For example:
{% include post/bloquote.html author=page.qoute.author occupation=page.qoute.occupation blockquote=page.qoute.blockquote author_photo=page.qoute.author_photo%}

-
