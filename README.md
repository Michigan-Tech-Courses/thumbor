# @mtucourses/thumbor

## 🏗 Usage

```ts
import {Thumbor} from '@mtucourses/thumbor';

const thumbor = new Thumbor({url: 'https://thumbor.example.com', key: 'a-sample-key'});

const url = thumbor
  .setPath('https://images.unsplash.com/photo-1611581893305-ec40e53882fc')
  .smartCrop(true)
  .resize(500, 0)
  .buildURL();
```

## 🧰  Development

```bash
# First:
# install dependencies
yarn install

# then:
# build in watch mode
yarn build:watch

# and you can:

# run tests
yarn test

# run tests in watch mode
yarn test:watch
```

To publish a new package version, run `npm version [patch|minor|major]` and then `git push && git push --tags` on the master branch.


Adapted from [this package](https://github.com/PolicyMic/thumbor/blob/master/index.js).
