# Anm

  Page animations by mouse moves

## Instalation  

  Via script tag in page sources:

```html
<script src="/static/js/anm.min.js"></script>
```

  Set anm elements class:

```html
<body data-anm=".anm">
```

## Attributes

### data-speed-x

  Set horizontal motion

```html
<h2 data-speed-x="1">...</h2>
```

### data-speed-y

  Set vertical motion

```html
<h2 data-speed-y="-1">...</h2>
```

  Inreasing `data-speed-x` or `data-speed-y` increases the range of motion.

  * `data-speed-x > 0` - in direction of mouse moves,
  * `data-speed-x < 0` - in reverse direction.

## API

### anm.elements
  
  Animated elements array

### anm.on()

  Enable animations

### anm.off()

  Disable animations

### anm.toggle()
  
  Toggle enabled of animations


