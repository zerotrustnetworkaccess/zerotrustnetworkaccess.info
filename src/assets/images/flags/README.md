# Flag assets

4:3 SVG flags, one per ISO 3166-1 alpha-2 code, shown against each vendor's
company name in the directory tables.

Source: https://github.com/lipis/flag-icons (`flags/4x3/`), MIT licensed. The
flag designs themselves are public domain; the MIT licence covers the SVG
artwork as packaged.

These are vendored rather than loaded from a CDN because the site's
Content-Security-Policy in `netlify.toml` allows images from `'self'` only.

To add a country: drop `<code lowercased>.svg` here and add the matching entry
to `src/_data/countries.yml`. A `country:` code with no entry in that file
renders no flag, so the two must be kept in step.
