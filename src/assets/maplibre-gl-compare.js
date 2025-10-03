'use strict'

import syncMove from '@mapbox/mapbox-gl-sync-move'
import EventEmitter from 'mitt'

/**
 *
 * Based on https://github.com/maplibre/maplibre-gl-compare/blob/main/index.js, modified to fit this use case
 *
 * @param {Object} a The first MapLibre GL Map
 * @param {Object} b The second MapLibre GL Map
 * @param {string|HTMLElement} container An HTML Element, or an element selector string for the compare container. It should be a wrapper around the two map Elements.
 * @param {Object} options
 * @param {string} [options.orientation=vertical] The orientation of the compare slider. `vertical` creates a vertical slider bar to compare one map on the left (map A) with another map on the right (map B). `horizontal` creates a horizontal slider bar to compare on mop on the top (map A) and another map on the bottom (map B).
 * @param {boolean} [options.mousemove=false] If `true` the compare slider will move with the cursor, otherwise the slider will need to be dragged to move.
 * @example
 * var compare = new maplibregl.Compare(beforeMap, afterMap, '#wrapper', {
 *   orientation: 'vertical',
 *   mousemove: true
 * });
 * @see [Swipe between maps](https://maplibre.org/maplibre-gl-js-docs/plugins/)
 */
function Compare (a, b, container, options) {
  this.options = options ? options : {}
  this._mapA = a
  this._mapB = b
  this._horizontal = this.options.orientation === 'horizontal'
  this._onDown = this._onDown.bind(this)
  this._onMove = this._onMove.bind(this)
  this._onMouseUp = this._onMouseUp.bind(this)
  this._onTouchEnd = this._onTouchEnd.bind(this)
  this._ev = new EventEmitter()
  this._swiper = document.createElement('div')
  this._swiper.className = this._horizontal
    ? 'compare-swiper-horizontal'
    : 'compare-swiper-vertical'

  this._controlContainer = document.createElement('div')
  this._controlContainer.className = this._horizontal
    ? 'maplibregl-compare maplibregl-compare-horizontal'
    : 'maplibregl-compare'
  this._controlContainer.className = this._controlContainer.className
  this._controlContainer.append(this._swiper)

  if (typeof container === 'string' && document.body.querySelectorAll) {
    // get container with a selector
    let appendTarget = document.body.querySelectorAll(container)[0]
    if (!appendTarget) {
      throw new Error('Cannot find element with specified container selector.')
    }
    appendTarget.append(this._controlContainer)
  } else if (container instanceof Element && container.appendChild) {
    // get container directly
    container.append(this._controlContainer)
  } else {
    throw new Error(
      'Invalid container specified. Must be CSS selector or HTML element.',
    )
  }
  // const self = this
  // this._controlContainer.addEventListener('resize', () => {
  //   if(self.type === 'sideBySide'){
  //     let swiperPosition
  //     = (self._horizontal ? self._bounds.height : self._bounds.width) / 2
  //     self._setPosition(swiperPosition)
  //   }
  // })

  this._bounds = b.getContainer().getBoundingClientRect()
  let swiperPosition
    = (this._horizontal ? this._bounds.height : this._bounds.width) / 2

  this._setPosition(swiperPosition)

  this._clearSync = syncMove(a, b)
  this._onResize = function () {
    let swiperPosition
      = (this._horizontal ? this._bounds.height : this._bounds.width) / 2
    this._setPosition(swiperPosition)
    this._bounds = a.getContainer().getBoundingClientRect()
    a.triggerRepaint()
    b.triggerRepaint()

  }.bind(this)

  b.on('resize', this._onResize)
  a.on('resize', this._onResize)
  window.addEventListener('resize', this._onResize)
  this.switchType(this?.options?.type || 'slider', a, b)
}

Compare.prototype = {

  _setPointerEvents (v) {
    this._controlContainer.style.pointerEvents = v
    this._swiper.style.pointerEvents = v
  },

  _onDown (e) {
    if (e.touches) {
      document.addEventListener('touchmove', this._onMove)
      document.addEventListener('touchend', this._onTouchEnd)
    } else {
      document.addEventListener('mousemove', this._onMove)
      document.addEventListener('mouseup', this._onMouseUp)
    }
  },

  _setPosition (x) {
    x = Math.min(
      x,
      this._horizontal ? this._bounds.height : this._bounds.width,
    )
    let pos = this._horizontal
      ? 'translate(0, ' + x + 'px)'
      : 'translate(' + x + 'px, 0)'
    this._controlContainer.style.transform = pos
    this._controlContainer.style.WebkitTransform = pos
    let clipA = this._horizontal
      ? 'rect(0, 999em, ' + x + 'px, 0)'
      : 'rect(0, ' + x + 'px, ' + this._bounds.height + 'px, 0)'
    let clipB = this._horizontal
      ? 'rect(' + x + 'px, 999em, ' + this._bounds.height + 'px,0)'
      : 'rect(0, 999em, ' + this._bounds.height + 'px,' + x + 'px)'

    this._mapA.getContainer().style.clip = clipA
    this._mapB.getContainer().style.clip = clipB
    this.currentPosition = x
  },

  _onMove (e) {
    console.log('on move')
    if (this.options && this.options.mousemove) {
      this._setPointerEvents(e.touches ? 'auto' : 'none')
    }

    this._horizontal
      ? this._setPosition(this._getY(e))
      : this._setPosition(this._getX(e))
  },

  _onMouseUp () {
    document.removeEventListener('mousemove', this._onMove)
    document.removeEventListener('mouseup', this._onMouseUp)
    this.fire('slideend', { currentPosition: this.currentPosition })
  },

  _onTouchEnd () {
    document.removeEventListener('touchmove', this._onMove)
    document.removeEventListener('touchend', this._onTouchEnd)
    this.fire('slideend', { currentPosition: this.currentPosition })
  },

  _getX (e) {
    e = e.touches ? e.touches[0] : e
    let x = e.clientX - this._bounds.left
    if (x < 0) {
      x = 0
    }
    if (x > this._bounds.width) {
      x = this._bounds.width
    }
    return x
  },

  _getY (e) {
    e = e.touches ? e.touches[0] : e
    let y = e.clientY - this._bounds.top
    if (y < 0) {
      y = 0
    }
    if (y > this._bounds.height) {
      y = this._bounds.height
    }
    return y
  },

  switchType (_type = 'slider') {
    const a = this._mapA
    const b = this._mapB
    let swiperPosition
      = (this._horizontal ? this._bounds.height : this._bounds.width) / 2
    this._setPosition(swiperPosition)
    if (_type === 'sideBySide') {
      a.getContainer().style.clip = null
      b.getContainer().style.clip = 'unset'
      b.getContainer().style.transform = 'translateX(50%)'
      this._controlContainer.style.display = 'none'
      // document.querySelectorAll('.compare-swiper-vertical')[0].style.display = 'none'
      if (this.options && this.options.mousemove) {
        a.getContainer().removeEventListener('mousemove', this._onMove)
        b.getContainer().removeEventListener('mousemove', this._onMove)
      }
      this._swiper.removeEventListener('mousedown', this._onDown)
      this._swiper.removeEventListener('touchstart', this._onDown)
    } else {
      this._controlContainer.style.display = 'inline-block'
      // document.querySelectorAll('.compare-swiper-vertical')[0].style.display = 'inline-block'
      b.getContainer().style.left = '-12px'
      b.getContainer().style.transform = 'none'
      if (this.options && this.options.mousemove) {
        a.getContainer().addEventListener('mousemove', this._onMove)
        b.getContainer().addEventListener('mousemove', this._onMove)
      }

      this._swiper.addEventListener('mousedown', this._onDown)
      this._swiper.addEventListener('touchstart', this._onDown)
    }
  },
  /**
   * Set the position of the slider.
   *
   * @param {number} x Slider position in pixels from left/top.
   */
  setSlider (x) {
    this._setPosition(x)
  },

  /**
   * Adds a listener for events of a specified type.
   *
   * @param {string} type The event type to listen for; one of `slideend`.
   * @param {Function} listener The function to be called when the event is fired.
   * @returns {Compare} `this`
   */
  on (type, fn) {
    this._ev.on(type, fn)
    return this
  },

  getPosition () {
    return (this._horizontal ? this._bounds.height : this._bounds.width) / 2
  },

  /**
   * Fire an event of a specified type.
   *
   * @param {string} type The event type to fire; one of `slideend`.
   * @param {Object} data Data passed to the event listener.
   * @returns {Compare} `this`
   */
  fire (type, data) {
    this._ev.emit(type, data)
    return this
  },

  /**
   * Removes an event listener previously added with `Compare#on`.
   *
   * @param {string} type The event type previously used to install the listener.
   * @param {Function} listener The function previously installed as a listener.
   * @returns {Compare} `this`
   */
  off (type, fn) {
    this._ev.removeListener(type, fn)
    return this
  },

  remove () {
    this._clearSync()
    this._mapB.off('resize', this._onResize)
    this._mapA.off('resize', this._onResize)

    let aContainer = this._mapA.getContainer()

    if (aContainer) {
      aContainer.style.clip = null
      aContainer.removeEventListener('mousemove', this._onMove)
    }

    let bContainer = this._mapB.getContainer()

    if (bContainer) {
      bContainer.style.clip = null
      bContainer.removeEventListener('mousemove', this._onMove)
    }

    this._swiper.removeEventListener('mousedown', this._onDown)
    this._swiper.removeEventListener('touchstart', this._onDown)
    this._controlContainer.remove()
  },
}

export default Compare
