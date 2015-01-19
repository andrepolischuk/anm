# Anm

  Page animations by mouse and touch moves

## Instalation

  Browser:

```html
<script src="https://cdn.rawgit.com/andrepolischuk/anm/1.1.0/anm.min.js"></script>
```

  Component(1):

```sh
$ component install andrepolischuk/anm
```

  Npm:

```sh
$ npm install anm
```

## Use

  Set anm elements class:

```html
<body data-anm=".anm">
```

## Attributes

  All attributes set in percent of max value.
  Positive values set direct motion, negative - inverse (excluding opacity).

### data-speed-x

  Set horizontal motion

```html
<h2 data-speed-x="25">...</h2>
```

### data-speed-y

  Set vertical motion

```html
<h2 data-speed-y="-15">...</h2>
```

### data-speed-scale

  Set element scaling

```html
<h2 data-speed-scale="-40">...</h2>
```

### data-speed-opacity

  Set element opacity

```html
<h2 data-speed-opacity="50">...</h2>
```

### data-speed-rotation

  Set element rotation

```html
<h2 data-speed-rotate="35">...</h2>
```

## API

### anm.elements

  Animated elements array

### anm.on()

  Enable animations

### anm.off()

  Disable animations

### anm.toggle()

  Toggle enabled of animations


