.PHONY: all clean watch

NODE := $(shell which node)
LESSC := node_modules/.bin/lessc
HANDLEBARS := node_modules/.bin/handlebars
POSTCSS := scripts/postcss.js

lessfiles := $(shell find css/ -name "*.less")
cssfiles := $(lessfiles:%.less=%.css)
handlebars := $(shell find views/ -name "*.hbs")
allcss = $(shell find css/ -name "*.css" \
			| grep -v 'reset.css' \
			| grep -v 'common.css')
alljs = $(shell echo "main.js" \
			&& find {config,controllers,handlers,lib,models} -name "*.js" \
			| grep -v '(ignore|\.thread\.)')

all: $(cssfiles) lib/app/templates.js .build/postcss index.html

%.css: %.less
	@echo "- LESS:" $< "->" $@
	@$(LESSC) --include-path=css/ $< > $@

lib/app/templates.js: $(handlebars)
	@echo "- Handlebars: " $?
	@$(HANDLEBARS) -r views -e "hbs" -n "ViewTemplates" -f $@ $^
	@echo 'var ViewTemplates = {};' > .build/templates.js
	@cat $@ >> .build/templates.js
	@mv .build/templates.js $@

.build/postcss: $(allcss) $(cssfiles)
	@echo "- postcss:" $?
	@$(NODE) $(POSTCSS) --use autoprefixer --replace $?
	@touch $@

index.html: $(allcss) $(alljs) $(cssfiles) lib/app/templates.js views/layouts/default.html .build/postcss scripts/include.sh scripts/gen-index
	@echo "- $@: " $?
	@./scripts/gen-index

clean:
	rm -f $(allcss)
	rm -f lib/app/templates.js
	rm -f .build/*
	rm -f index.html

watch:
	@./scripts/watch

