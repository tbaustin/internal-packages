# npm-package-boilerplate
A boilerplate for creating NPM packages (new 2020)

Uses Babel and Jest, comes with the following scripts by default:  
- `yarn build` – transpiles all files in `src` and outputs to `dist`
- `yarn test` – runs Jest (assuming any files use it; see example in `src`)


## Adding a new package to a monorepo:  
1. Clone this repo **outside** the monorepo folder
2. Copy & paste this repo's folder into the monorepo's `packages` folder
3. Rename the pasted folder to the package name
4. Update the pasted folder's `package.json` to have the desired package name, version, etc.
5. Update the pasted folder's `.npmrc` to have the desired version tag prefix for Git (e.g. *zygote-plugin-whatever@*)
6. Make any source code changes/additions desired for the initial commit of the package
7. Commit the above changes to the monorepo
8. Run `lerna bootstrap` or `yarn bootstrap` at the root level of the monorepo
9. Publish the package with Yarn/NPM/Lerna (see readme in monorepos)
