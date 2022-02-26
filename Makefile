# export CAPACITOR_ANDROID_STUDIO_PATH = /usr/bin/android-studio

lint:
	npx eslint --ext .js,.jsx,.ts,.tsx --fix src

start:
	npx react-scripts start

only-build:
	npx react-scripts build

sync:
	npx cap sync android

build: patch-version only-build sync

patch-version:
	npm version patch

minor-version:
	npm version minor

open: only-build sync
	npx cap open android

generate-resources:
	npx capacitor-resources -p android