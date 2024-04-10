install:
	yarn

dev-site:
	yarn docs:dev

built-site:
	yarn docs:build

import:
	node ./index.js import

export:
	node ./index.js export

lint:
	yarn lint

lintfix:
	yarn lint:fix

test:
	yarn test