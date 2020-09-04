# escalade-internal
Shared packages & libraries used internally for Escalade Sports websites.

test change

---

## Versioning & Publishing Packages

Assuming you've added and tested changes to packages on your own branch, you can publish the changes as new versions by following the steps below.

1. Check out the `master` branch locally and pull all latest changes from GitHub. Also make sure all latest tags are downloaded by running:
```bash
git fetch --tags
```

2. Merge the changes from your branch into `master` and resolve any conflicts. Alternatively, you can open/review/merge a pull request on GitHub and then pull `master` again.

3. Double-check which packages Lerna thinks have changed and need to be versioned/published. From the monorepo root, run:
```bash
yarn changed
```
If the result isn't what you're expecting, see [Gotchas and Important Notes](#weirdness-with-yarn-changed) below.

4. Bump the version of each changed package interactively. From the monorepo root, run:
```bash
yarn new-version
```

5. Build packages and publish the new versions. From the monorepo root, run:
```bash
yarn new-publish
```
or:
```bash
yarn build
yarn publish-packages
```
If an error happens during this step, see [Gotchas and Important Notes](#publish-errors-and-githead-in-packagejson) below.

---

## Gotchas and Important Notes
#### Weirdness with `yarn changed`
Sometimes packages you didn't directly work on will show as changed. This can be for one of two reasons:
1. You've forgotten to fetch the latest tags from GitHub (step 1) and another developer has published the newest package versions from their machine. You don't have the tags yet because Git doesn't automatically fetch tags when running `git pull`. Since Lerna uses local Git tags to determine the latest published versions, it won't know about the versions published by the other developer until you fetch the tags.
2. The package you changed is in the `package.json` dependencies of another package in the monorepo. Lerna will consider that package changed as well. The simplest thing to do is to go ahead and publish new versions for both packages. Assuming you're taking care to publish a [SemVer release type](https://semver.org/) that's appropriate for the kind of changes you made to the package you worked on, the package you *didn't* work on shouldn't be affected and can be a patch release. Having extra patch versions is no big deal.

#### Publish errors and `gitHead` in `package.json`
If any error happens during the publish step, Lerna will probably leave a `gitHead` property added to `package.json` in every package. Discard those changes, and for the love of all that is good, **don't commit** them, as it will mess up Lerna if you do. The error most likely involved only one or two of the packages, and the rest probably published successfully (check NPM to verify). After discarding the `gitHead` property and figuring out/fixing whatever caused your error, you can try `yarn new-publish` again.
