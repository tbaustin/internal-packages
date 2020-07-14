# escalade-internal

### Shared packages & libraries used internally for Escalade Sports websites.


## Publishing NPM packages

1. Make sure to be on the most up-to-date master with all changes pulled from GH & your branch merged in

2. Determine what changed in the monorepo root to double-check & verify what packages it thinks need to be versioned/published\
`yarn changed`

3. Bump the version with (PREFERRED METHOD)\
`yarn new-version`

4. Build and Publish packages\
`yarn new-publish`\
or\
`yarn build` \
`yarn publish-packages`

If an error happens during all that, Lerna will probably leave you with a gitHead property added to all the package.json files. Discard those changes and for the love of all that is good, don't commit them to Git. Most likely, the error was with just one or two of the packages and the rest published just fine – but it will mess things up if you commit package.json files containing the gitHead property.
