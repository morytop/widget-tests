# QA Engineer Recruitment test

## Before you start

Test is based on Playwright v1.22.2. You can find the full playwright documentation [here](https://playwright.dev/docs/intro). To build the project you will need [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/getting-started/install).
In the file `widget.test.ts` are initial steps of the test.

The task consists of two parts: 

* Add the two missing steps to the test
* Use a docker to containerize project (optional)

### Commands

In the project directory, you can run:

#### `yarn`

Installs a package and any packages that it depends on.

#### `yarn run test`

Launches test headless.

#### `yarn run dev`

Launches test non-headless with playwright inspector.

### Container

To containerize project I used Playwright Docker image. To run test from the docker you will need [Docker](https://www.docker.com/get-started/).

#### Run a container

```shell
docker run -it --rm --ipc=host -v ${PWD}:/tests -w /tests mcr.microsoft.com/playwright:v1.22.0-focal /bin/bash
```

#### Run test

```root@921ac7676524:/tests# yarn run test
```