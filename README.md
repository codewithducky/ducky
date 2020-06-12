# Ducky

Programming is hard, and learning it is even harder. Ducky is a step in the
direction of making that easier, it is a VSCode extension that can be used to
collect error reports from novice programmers using p5.js.

There's two separate projects in this repository:

1. The web app (a Rails 6 web app consisting of a RESTful API for data
   collection, and an authenticated dashboard for viewing the collected data)
2. The extension (a VSCode extension which interacts with the RESTful API and
   provides a development server for writing p5.js code)

## Installation

The following guide assumes:

1. you're using some sort of *nix
2. your `cwd` is the root of this repository
3. you have postgres, ruby, and VSCode installed

### Web app

1. `$ cd server`
2. `$ bundle install` (if you don't have postgres installed, you'll find out
   here)
3. `$ yarn install`
4. `$ rails db:create`
5. `$ rails s`
6. the server should now be running on localhost:3000!

### The extension

1. `$ cd vsc-extension`
2. `$ yarn install`
3. `$ code .`
4. from here you can test the extension by entering debug mode in the workspace
5. there's a "test workspace" in the `test` folder of this repository, if you
   open that you will find yourself in an environment which mimics a COMP1720 lab.
