lint:
	npx eslint --ext .js,.jsx,.ts,.tsx --fix src

start:
	npx react-scripts start

build: test patch-version
	npx react-scripts build

test:
	npx react-scripts test

patch-version:
	npm version patch

minor-version:
	npm version minor