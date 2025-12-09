export default class PinchZoom {
	constructor(imageElement, touchEndReset = true) {
		this.imageElement = imageElement
		this.imageElementScale = 1
		this.start = {}
		this.lastTouch = {}
		this.handleTouchStart = this.touchstart.bind(this)
		this.handleTouchMove = this.touchmove.bind(this)
		this.handleTouchEnd = this.touchend.bind(this)
		this.handleDoubleClick = this.doubleClick.bind(this)
		this.touchEndReset = touchEndReset
	}

	touchstart(event) {
		if (event.touches.length === 2) {
			event.preventDefault()

			this.start.x = (event.touches[0].pageX + event.touches[1].pageX) / 2
			this.start.y = (event.touches[0].pageY + event.touches[1].pageY) / 2
			this.start.distance = this.distance(event)
		} else if (event.touches.length === 1) {
			this.lastTouch.x = event.touches[0].pageX
			this.lastTouch.y = event.touches[0].pageY
		}
	}

	touchmove(event) {
		if (event.touches.length === 2) {
			event.preventDefault()

			if (!this.rafPending) {
				this.rafPending = true
				requestAnimationFrame(() => {
					this.rafPending = false

					let scale
					if (event.scale) {
						scale = event.scale
					} else {
						const deltaDistance = this.distance(event)
						scale = deltaDistance / this.start.distance
					}
					this.imageElementScale = Math.min(Math.max(1, scale), 4)

					const deltaX = ((event.touches[0].pageX + event.touches[1].pageX) / 2 - this.start.x) * 2
					const deltaY = ((event.touches[0].pageY + event.touches[1].pageY) / 2 - this.start.y) * 2

					const transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${this.imageElementScale})`
					this.imageElement.style.transform = transform
					this.imageElement.style.WebkitTransform = transform
				})
			}
		} else if (event.touches.length === 1 && this.imageElementScale > 1 && !this.touchEndReset) {
			console.log('Single touch detected, resetting zoom')
			event.preventDefault()

			const deltaX = event.touches[0].pageX - this.lastTouch.x
			const deltaY = event.touches[0].pageY - this.lastTouch.y

			this.lastTouch.x = event.touches[0].pageX
			this.lastTouch.y = event.touches[0].pageY

			const currentTransform = this.imageElement.style.transform || ''
			const translateMatch = currentTransform.match(/translate3d\(([^)]+)\)/)
			let currentTranslate = { x: 0, y: 0 }

			if (translateMatch) {
				const [x, y] = translateMatch[1].split(',').map(val => parseFloat(val))
				currentTranslate = { x, y }
			}

			const newTranslateX = currentTranslate.x + deltaX
			const newTranslateY = currentTranslate.y + deltaY

			const transform = `translate3d(${newTranslateX}px, ${newTranslateY}px, 0) scale(${this.imageElementScale})`
			this.imageElement.style.transform = transform
			this.imageElement.style.WebkitTransform = transform
		}
	}

	touchend() {
		this.imageElementScale = 1
		this.imageElement.style.transform = 'scale(1)'
		this.imageElement.style.WebkitTransform = 'scale(1)'
	}

	doubleClick() {
		this.imageElementScale = 1
		this.imageElement.style.transform = 'scale(1)'
		this.imageElement.style.WebkitTransform = 'scale(1)'
	}

	distance(event) {
		return Math.hypot(
			event.touches[0].pageX - event.touches[1].pageX,
			event.touches[0].pageY - event.touches[1].pageY
		)
	}

	enable() {
		this.imageElement.addEventListener('touchstart', this.handleTouchStart)
		this.imageElement.addEventListener('touchmove', this.handleTouchMove)
		if (this.touchEndReset) this.imageElement.addEventListener('touchend', this.handleTouchEnd)
		this.imageElement.addEventListener('dblclick', this.handleDoubleClick)
	}

	disable() {
		this.imageElement.removeEventListener('touchstart', this.handleTouchStart)
		this.imageElement.removeEventListener('touchmove', this.handleTouchMove)
		if (this.touchEndReset) this.imageElement.removeEventListener('touchend', this.handleTouchEnd)
		this.imageElement.removeEventListener('dblclick', this.handleDoubleClick)
	}
}
