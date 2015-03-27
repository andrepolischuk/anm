
default: test

test: build
	@open test/index.html

clean:
	@rm -rf build.js anm.js anm.min.js components node_modules

build: $(wildcard test/*.js)
	@duo --development --stdout test/test.js > build.js

bundle: index.js
	@duo --standalone anm --stdout index.js > anm.js
	@uglifyjs anm.js --mangle --compress --output anm.min.js

.PHONY: clean test
