# escalade-internal

Shared packages & libraries used internally for Escalade Sports websites.


# Publishing NPM packages though git cli

Determine version with\
`npm version`

Bump the version with (PREFERRED METHOD)\
`npm version patch || npm version minor || npm version major`

If you bump the version manually by editing package.json, \
When you `git push`, TravisCI will state\
`Skipping a deployment with the npm provider because this is not a tagged commit`\
    To fix this, you must run\
    `git tag [versionnumber]`

Once the version is properly set by either method\
`git push --tags`\
will trigger the TravisCI build, and then the NPM publish

Then\
`git push`\
will commit the updated version number on github repo

If the packacge is not set up to use Travis CI, then\
`npm publish`
