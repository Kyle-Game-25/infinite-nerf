"use strict"

const ON = OmegaNum

const id = function(id) {
	let elm = document.getElementById(id)
	
	Object.defineProperty(elm, "html", {
		value: null,
		configurable: true
	})
	
	Object.defineProperty(elm, "html", {
		get() {
			return elm.innerHTML
		},
		set(value) {
			if (typeof value == "function") {
				elm.innerHTML = value()
			} else if (Array.isArray(value)) {
				elm.innerHTML = value.join()
			} else {
				elm.innerHTML = value
			}
		}
	})
	
	Object.defineProperty(elm, "display", {
		value: null,
		configurable: true
	})
	
	Object.defineProperty(elm, "display", {
		get() {
			if (elm.style.display === "none") return false
			return true
		},
		set(value) {
			elm.style.display = value ? "" : "none"
		}
	})
	
	return elm
}

const game = {
	save: {},
	tick: {},
	func: {},
	start: {
		point: ON(0),
		tuon: ON(0),
		dilater: ON(0),
		compress: ON(0),
		timePassed: ON(0),
		limit: ON(0),
		limitUnlock: false,
		limUp: [false, false, false, false, false, false, false, false, false],
		lastTick: Date.now(),
		diff: 0,
		timePlayed: 0,
		options: {
			infinitySymbol: true,
			digitSeperator: 0,
			theme: "light"
		}
	},
	other: {
		loading: true,
		saveError: false,
		screens: {},
		randomMsg: [
			"This game is about long timewalls. Why are you even playing this?",
			"Yes! I just got an infinitesimally small amount of points",
			"This game makes me appreciate that I atleast get some tangible quantity",
			"TUONS ARE THE DUMBEST CRAP EVER! WHO GIVES A FRICK ABOUT THEM - Tuon Hater",
			"NO! INFLATION IS EATING ME ALIVE! I was used to the slowness",
			"Having one point is an accomplishment in this game",
			"Dilation? More like... uh... I don't have a funny joke",
			"Compressors compress time, so wouldn't it make the Production Cap smaller?",
			"This game does not use cookies to store information."
		]
	}
}

const format = {
	infismall(number) {
		let x = ON(number)
		if (x.lte(0)) return "0"
		if (x.lt(1e308)) return format.normal(x) + "ε"
		return format.normal(x.div(1e308).cbrt())
	},
	
	normal(number) {
		let x = ON(number)
		
		if (x.isNegative()) {
			return "-" + format.normal(x.abs())
		} else if (x.isNaN()) {
			return "NaN"
		} else if (x.isInfinite()) {
			return "Infinity"
		} else if (x.eq(0)) {
			return "0"
		} else if (x.lt(1e6) && x.gt(0.00001)) {
			if (x.lt(1)) {
				let y = x.log10().abs().floor()
				let z = "0."
				for (let i = 1; y.gte(i-2); i++) z += x.mul(ON(10).pow(i)).floor().mod(10)
				return z
			} else if (x.lt(1e3)) {
				return x.floor() + "." + x.mul(10).floor().mod(10) + x.mul(100).floor().mod(10)
			} else {
				let digitSeperator = [",", "'", "_"][game.save.options.digitSeperator]
				let y = x.mod(1e3).floor().toString()
				return x.div(1e3).floor() + digitSeperator + "0".repeat(3-y.length) + y
			}
		} else {
			let y = ON(10).pow(x.log10().floor())
			return x.div(y).floor() + "." + x.div(y).mul(10).floor().mod(10) + x.div(y).mul(100).floor().mod(10) + "e" + y.log10()
		}
	},
	
	whole(number) {
		let x = ON(number)
		if (x.isNegative()) return "-" + format.whole(x.abs())
		if (x.isNaN()) return "NaN"
		if (x.isInfinite()) return "Infinity"
		if (x.eq(0)) return "0"
		if (x.lt(1e3)) return String(x.floor())
		return format.normal(x)
	},
	
	time(second) {
		return time(ON(second), 3)
		
		function time(x, y) {
			let z = ''
			
			if (y < 3) {
				z = ", "
				if (x.lte(0)) return ''
			}
			
			if (y > 0) {
				if (x.lt(1)) {
					if (y < 3) z = " and "
					z += format.normal(x.mul(1000)) + " milliseconds"
				} else if (x.lt(60)) {
					if (x.sub(x.floor()).lte(0) && y < 3) z = " and "
					z += format.whole(x) + " second" + isSingularAt(1) + time(x.sub(x.floor()), y-1)
				} else if (x.lt(3600)) {
					if (x.sub(x.div(60).floor().mul(60)).lte(0) && y < 3) z = " and "
					z += format.whole(x.div(60)) + " minute" + isSingularAt(60) + time(x.sub(x.div(60).floor().mul(60)), y-1)
				} else if (x.lt(86400)) {
					if (x.sub(x.div(3600).floor().mul(3600)).lte(0) && y < 3) z = " and "
					z += format.whole(x.div(3600)) + " hour" + isSingularAt(3600) + time(x.sub(x.div(3600).floor().mul(3600)), y-1)
				} else {
					if (x.sub(x.div(86400).floor().mul(86400)).lte(0) && y < 3) z = " and "
					z += format.whole(x.div(86400)) + " day" + isSingularAt(86400) + time(x.sub(x.div(86400).floor().mul(86400)), y-1)
				}
				
				return z
			} else {
				z = " and "
				if (x.lt(1)) return z + format.normal(x.mul(1000)) + " milliseconds"
				if (x.lt(60)) return z + format.normal(x) + " second" + (x.floor().eq(1) ? "":"s")
				if (x.lt(3600)) return z + format.normal(x.div(60)) + " minute" + (x.div(60).floor().eq(1) ? "":"s")
				if (x.lt(86400)) return z + format.normal(x.div(3600)) + " hour" + (x.div(3600).floor().eq(1) ? "":"s")
				return z + format.normal(x.div(86400)) + " day" + (x.div(86400).floor().eq(1) ? "":"s")
			}
			
			function isSingularAt(y) {
				return x.div(y).floor().eq(1) ? "":"s"
			}
		}
	},
	
	total(number) {
		let x = format.normal(ON(number)).split('').reverse()
		
		if (x.includes(".")) {
			while (x[0] == "0") x.shift()
			if (x[0] == ".") x.shift()
		}
		
		return x.reverse().join('')
	},
	
	totalTime(second) {
		return time(ON(second), 3)	
		
		function time(x, y) {
			let z = ''
			
			if (y < 3) {
				z = ", "
				if (x.lte(0)) return ''
			}
			
			if (y > 0) {
				if (x.lt(1)) {
					if (y < 3) z = " and "
					z += format.total(x.mul(1000)) + " milliseconds"
				} else if (x.lt(60)) {
					if (x.sub(x.floor()).lte(0) && y < 3) z = " and "
					z += format.total(x.floor()) + " second" + isSingularAt(1) + time(x.sub(x.floor()), y-1)
				} else if (x.lt(3600)) {
					if (x.sub(x.div(60).floor().mul(60)).lte(0) && y < 3) z = " and "
					z += format.total(x.div(60).floor()) + " minute" + isSingularAt(60) + time(x.sub(x.div(60).floor().mul(60)), y-1)
				} else if (x.lt(86400)) {
					if (x.sub(x.div(3600).floor().mul(3600)).lte(0) && y < 3) z = " and "
					z += format.total(x.div(3600).floor()) + " hour" + isSingularAt(3600) + time(x.sub(x.div(3600).floor().mul(3600)), y-1)
				} else {
					if (x.sub(x.div(86400).floor().mul(86400)).lte(0) && y < 3) z = " and "
					z += format.total(x.div(86400).floor()) + " day" + isSingularAt(86400) + time(x.sub(x.div(86400).floor().mul(86400)), y-1)
				}
				
				return z
			} else {
				z = " and "
				if (x.lt(1)) return z + format.total(x.mul(1000)) + " milliseconds"
				if (x.lt(60)) return z + format.total(x) + " second" + (x.floor().eq(1) ? "":"s")
				if (x.lt(3600)) return z + format.total(x.div(60)) + " minute" + (x.div(60).floor().eq(1) ? "":"s")
				if (x.lt(86400)) return z + format.total(x.div(3600)) + " hour" + (x.div(3600).floor().eq(1) ? "":"s")
				return z + format.total(x.div(86400)) + " day" + (x.div(86400).floor().eq(1) ? "":"s")
			}
			
			function isSingularAt(y) {
				return x.div(y).floor().eq(1) ? "":"s"
			}
		}
	},
	
	totalInf(number) {
		let x = ON(number)
		if (x.lte(0)) return "0"
		if (x.eq(1)) return "ε"
		if (x.lt(1e308)) return format.total(x) + "ε"
		return format.total(x.div(1e308).cbrt())
	}
}

const tab = function(up, sub) {
	let amt = id("headerButton").children.length
	for (let i = 0; i < amt; i++) id("utab_" + i).display = false
	id("utab_" + up).display = true
	update("random_message")
	
	if (!isNaN(sub)) {
		let amt = id("utab_" + up).children.length
		let a = 0
		for (let i = 0; i < amt; i++) {
			if (id("utab_" + up).children[i].id.includes("stab")) {
				id("stab_" + up + "-" + a).display = false
				a++
			}
		}
		id("stab_" + up + "-" + sub).display = true
	}
}

const cursor = function(elm, req) {
	elm.style.cursor = req ? "pointer" : "default"
	elm.classList[req ? "add" : "remove"]("buttonHover")
}

const reset = function() {
	game.save = [game.start][0]
	implort(explort(), true)
}

const implort = function(save) {
	if (save.substr(0, 2) != "ey") {
		disputeError()
		return
	}
	
	save = JSON.parse(atob(save.slice(2)).split('').reverse().join(''))
	setObject(save, game.start)
	
	save.lastTick = Date.now()
	
	if (game.other.saveError) disputeError()
	game.other.saveError = false
	game.save = save
	
	localStorage.setItem("infinite_nerf", explort())
	
	function disputeError() {
		throw "SaveError: The save file has become invalid" 
	}
	
	function setObject(x, s) {
		for (let item in s) {
			if (s[item] instanceof ON) {
				x[item] = ON(x[item])
				if (x[item].isNaN()) {
					game.other.saveError = true
					x[item] = ON(s[item])
				}
			} else if (x[item] == undefined) x[item] = s[item]
			else if (typeof x[item] == "object") setObject(x[item], s[item])
		}
	}
}

const importText = function() {
	id("importedTextResult").html = "Import Successful!"
	
	try {
		implort(document.getElementById('importText').value)
	} catch {
		id("importedTextResult").html = "Import Failed!"
	}
}

const explort = function() {
	let x = {}
	let s = game.start
	
	for (let item in s) {
		if (s[item] instanceof ON) x[item] = game.save[item].toString()
		else x[item] = game.save[item]
	}
	
	return "ey" + btoa(JSON.stringify(x).split('').reverse().join(''))
}

const exportToFile = function() {
	// Credit: https://www.tutorialspoint.com/how-to-create-and-save-text-file-in-javascript
	let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	let link = document.createElement("a")
	let file = new Blob([explort()], { type: 'text/plain' })
	
	link.href = URL.createObjectURL(file)
	link.download = `Infinite Nerf - ${month[func("getMonth")]} ${func("getDate")}, ${func("getFullYear")}.txt`
	link.click()
	
	function func(x) {
		return (new Date)[x]()
	}
}

const exportToClipboard = function() {
	navigator.clipboard.writeText(explort())
}

const saveGame = function() {
	implort(explort())
}

game.func = {
	reset(id) {
		game.save.point = ON(0)
		game.save.tuon = ON(0)
		game.save.timePassed = ON(0)
		if (id > 0) game.save.dilater = ON(0)
		if (id > 1) game.save.compress = ON(0)
	},
	activateTheme(theme) {
		game.save.options.theme = theme
	},
	toggleInfinitySymbol() {
		game.save.options.infinitySymbol = !game.save.options.infinitySymbol
		id("toggleInfinitySymbol").html = "Infinity Symbol: " + (game.save.options.infinitySymbol ? "ON" : "OFF")
	},
	switchDigitSeperator() {
		let nameOfSeperator = ["Commas", "Quotes", "Underscore"]
		game.save.options.digitSeperator++
		game.save.options.digitSeperator %= 3
		id("switchDigitSeperator").html = "Digit Seperator: " + nameOfSeperator[game.save.options.digitSeperator]
	},
	prestige(id) {
		if (id == 0 && game.save.point.gte(game.tick.dilaterCost)) {
			game.func.reset(0)
			game.save.dilater = game.save.dilater.add(1)
		} else if (id == 1 && game.save.dilater.gte(game.tick.compCost)) {
			game.func.reset(1)
			game.save.compress = game.save.compress.add(1)
		} else if (id == 2 && game.save.point.gte(5)) {
			game.save.limit = game.save.limit.add(game.func.getPrestigeGain(2))
			game.func.reset(2)
		}
	},
	getPrestigeGain(id) {
		if (id < 2) return ON(0)
		
		if (id == 2) {
			let gain = game.save.point.sub(4)
			if (gain.gt(5)) gain = gain.mul(5).sqrt()
			return gain.floor()
		}
	},
	getPrestigeReq(id) {
		if (id == 0) {
			if (game.save.dilater.lte(0)) return ON(0)
			return ON.pow(2, game.save.dilater.sub(1).div(8))
		} else if (id == 1) {
			return game.save.compress.add(1).pow(2)
		} else if (id == 2) {
			let gain = game.func.getPrestigeGain(2)
			if (gain.gte(5)) gain = gain.pow(2).div(5)
			return gain.add(4)
		}
	},
	getPrestigeNextReq(id) {
		if (id == 0) return
		if (id == 1) return
		
		if (id == 2) {
			let gain = game.func.getPrestigeGain(2).add(1)
			if (gain.gte(5)) gain = gain.pow(2).div(5)
			return gain.add(4)
		}
	},
	getLimUp(id) {
		if (game.save.limit.gte(game.tick.limUpCosts[id]) && !game.save.limUp[id]) {
			game.save.limit = game.save.limit.sub(game.tick.limUpCosts[id])
			game.save.limUp[id] = true
		}
	}
}

game.tick = {
	get tuonEff() {
		let eff = game.save.tuon.add(1).sqrt()
		if (game.save.limUp[1]) eff = eff.root(1.5)
		return eff
	},
	get tuonGain() {
		return game.save.tuon.pow(0.85).add(1).mul(game.tick.time)
	},
	get freeDilater() {
		let free = ON(0)
		if (game.save.limUp[0]) free = free.add(4)
		if (game.save.limUp[6]) free = free.add(game.save.compressor)
		return free
	},
	get dilaterCost() {
		return game.func.getPrestigeReq(0)
	},
	get dilaterEff() {
		let eff = game.save.dilater.add(game.tick.freeDilater).mul(game.tick.compEff2).max(0)
		if (game.save.limUp[2]) eff = eff.mul(2)
		if (game.save.limUp[5]) eff = eff.mul(2)
		if (eff.gt(16)) eff = eff.sqrt().mul(4)
		return eff
	},
	get freeComp() {
		let free = ON(0)
		if (game.save.limUp[3]) free = free.add(1)
		return free
	},
	get compCost() {
		return game.func.getPrestigeReq(1)
	},
	get compEff1() {
		let eff = game.save.compress.add(game.tick.freeComp)
		if (eff.gte(16)) eff = eff.add(eff.sqrt().mul(4))
		else eff = eff.mul(2)
		if (game.save.limUp[4]) eff = eff.mul(1.1)
		if (game.save.limUp[8]) eff = eff.mul(game.tick.limitEff)
		return eff
	},
	get compEff2() {
		let eff = game.save.compress.add(game.tick.freeComp)
		if (game.save.limUp[7]) eff = eff.root(1.5)
		else eff = eff.sqrt()
		return eff
	},
	get limitEff() {
		let eff = game.save.limit.add(1).sqrt()
		if (eff.gt(4)) eff = eff.logBase(2).mul(2)
		return eff.sqrt()
	},
	get time() {
		let time = game.tick.dilaterEff.mul(game.tick.limitEff).div(game.tick.tuonEff).div(1024)
		return time
	},
	get timeCap() {
		return game.tick.compEff1
	},
	get pointGain() {
		let gain = game.tick.time
		if (gain.gt(1)) gain = gain.sqrt()
		return gain
	},
	get limUpCosts() {
		return [ON(1), ON(1), ON(1), ON(2), ON(2), ON(2), ON(3), ON(5), ON(10)]
	}
}

const update = function(type) {
	if (type == "theme_button") {
		let j = 0
		let theme = ["light", "dark"]
		let name = ["Light", "Dark"]
		let elm = id("stab_1-1").children
		
		for (let i = 0; i < elm.length; i++) {
			if (elm[i].nodeName == "BUTTON") {
				elm[i].textContent = name[j] + " Theme " + (theme[j] == game.save.options.theme ? "Activated":"")
				elm[i].style.cursor = (theme[j] == game.save.options.theme ? "default":"pointer")
				j++
			}
		}
	} else if (type == "random_message") {
		let msg = game.other.randomMsg
		let random = Math.floor(Math.random()*msg.length)
		id("randomMsg").html = msg[random]
	}
}

const tick = function() {
	let func = game.func
	let save = game.save
	let tick = game.tick
	let other = game.other
	let customScreens = other.screens
	
	save.diff += Date.now() - save.lastTick
	let takeTick = Math.max(Math.ceil(save.diff/10), 50)
	
	if (save.diff - takeTick < 0) takeTick = save.diff
	
	save.lastTick = Date.now()
	save.diff -= takeTick
	let diff = ON(takeTick).div(1e3)
	
	// Updating variables
	
	if (save.diff > 10000) {
		customScreens.offlineTickScreen.display = true
	} else {
		customScreens.offlineTickScreen.display = false
	}
	
	if (game.save.point.gte(5)) game.save.limitUnlock = true
	
	// Production
	
	if (save.timePassed.lt(tick.timeCap)) {
		save.point = save.point.add(tick.pointGain.mul(diff))
		save.point = ON.pow(0.9, tick.time.mul(diff)).mul(save.point)
		save.tuon = save.tuon.add(tick.tuonGain.mul(diff))
	}
	
	save.timePlayed += diff.toNumber()
	save.timePassed = save.timePassed.add(tick.time.mul(diff))
	
	// Display part
	
	for (let data in customScreens) {
		let customScreen = customScreens[data]
		
		customScreen.x = Math.max(Math.min(customScreen.x, document.body.clientWidth - id(data).clientWidth - 4), 0)
		customScreen.y = Math.max(Math.min(customScreen.y, document.body.clientHeight - id(data).clientHeight - 4), 0)
		
		if (customScreen.mousedown) id(data + "Head").style.cursor = "grabbing"
		else id(data + "Head").style.cursor = "grab"
		
		id(data).style.transform = "translate(" + customScreen.x + "px, " + customScreen.y + "px)"
		id(data).display = customScreen.display
	}
	
	let pointGain = tick.pointGain.sub(ON.pow(0.9,tick.time).neg().add(1).mul(save.point.div(100)))
	let style = id("styleMode")
	
	tagHTML("infinity_text", save.options.infinitySymbol ? "\u221e":"Infinity")
	tagHTML("infinite_text", save.options.infinitySymbol ? "\u221e":"Infinite")
	
	tagHTML("point", format.infismall(save.point))
	tagHTML("pointGain", format.infismall(pointGain))
	tagHTML("tuon", format.normal(save.tuon))
	tagHTML("tuonEffect", format.normal(tick.tuonEff))
	tagHTML("tuonGain", format.normal(tick.tuonGain))
	tagHTML("dilater", format.total(save.dilater) + (tick.freeDilater.gt(0) ? ("+" + format.total(tick.freeDilater)):"") + " dilater" + grammarFrom(save.dilater.add(tick.freeDilater)))
	tagHTML("dilaterEffect", format.total(tick.dilaterEff))
	tagHTML("compress", save.compress + (tick.freeComp.gt(0) ? ("+" + format.total(tick.freeComp)):"") + " compressor" + grammarFrom(save.compress))
	tagHTML("compressEffect1", format.time(tick.compEff1))
	tagHTML("compressEffect2", format.total(tick.compEff2))
	tagHTML("limit", format.total(save.limit) + " limit" + grammarFrom(save.limit))
	
	id("loadScreen").display = false
	id("headerButton").display = true
	if (other.loading) id("utab_0").display = true
	
	if (id("utab_0").display) {
		id("fxTime").html = function(){
			if (tick.time.lte(0)) return "Time is halted relative to real-time"
			if (tick.time.lt(1)) return `Time is ${format.normal(ON(1).div(tick.time))}x slower than real-time`
			return `Time is ${format.normal(tick.time)}x faster than real-time`
		}
		
		id("fxProdCap").html = `Production is only ${format.total(tick.timeCap)} second${grammarFrom(tick.timeCap)} long`
	}
	
	if (id("utab_2").display) {
		id("statPointEquivalent").html = `If every point were a liter of water, you would have enough to fill ${format.totalInf(save.point.mul(4))} cups`
		id("statTimePlayed").html = format.totalTime(save.timePlayed)
		id("statLastUpdated").html = format.totalTime(Math.round((Date.now() - 1680847200000) / 1000))
	}
	
	if (id("utab_4").display) {
		id("dilaterCost").html = `Req: ${format.totalInf(tick.dilaterCost)} points`
		id("compCost").html = `Req: ${format.total(tick.compCost)} dilater${tick.compCost.eq(1) ? "":"s"}`
		id("timePassed").html = format.time(save.timePassed)
		id("timePassedMax").html = save.timePassed.lt(tick.timeCap) ? "":" (maxed out)"
	}
	
	id("limitTabButton").html = save.limitUnlock ? "Limit":"???"
	
	id("stab_5-locked").display = !save.limitUnlock
	id("stab_5-0").display = save.limitUnlock
	
	cursor(id("dilaterUpg"), game.save.point.gte(game.tick.dilaterCost))
	cursor(id("compressUpg"), game.save.dilater.gte(game.tick.compCost))
	cursor(id("limitPrestige"), game.save.point.gte(5))
	
	if (id("utab_5").display) {
		if (id("stab_5-0").display) {
			id("limitEff").html = function(){
				if (!save.limUp[8]) return ''
				return `, multiplying the first Compressor Effect by ${format.normal(tick.limitEff)}`
			}
			
			cursor(id("limitPrestigeText"), save.point.gte(5))
			
			id("limitPrestigeText").html = function(){
				if (save.point.lt(5)) return "Req: 5ε points"
				return `
					Reset for ${format.whole(func.getPrestigeGain(2))} limit${grammarFrom(game.func.getPrestigeGain(2))}<br>
					Next at ${format.total(func.getPrestigeNextReq(2))} points
				`
			}
			
			for (let i = 0; i < 7; i++) {
				cursor(document.getElementsByClassName("upgrade limit")[i], save.limit.gte(tick.limUpCosts[i]) && !game.save.limUp[i])
				id("limUpReq" + i).html = game.save.limUp[i] ? "Purchased":"Cost: " + format.whole(tick.limUpCosts[i])
			}
		}
	}
	
	update("theme_button")
	if (style.getAttribute("href") != save.options.theme + ".css") style.href = save.options.theme + ".css"
	
	function tagHTML(x, y) {
		Array.from(document.getElementsByClassName("update " + x)).forEach(function(item){
			item.innerHTML = y
		})
	}
	
	function grammarFrom(x) {
		return ON(x).eq(1) ? "":"s"
	}
}

const init = function() {
	const fileReader = new FileReader()
	let body = document.body
	let func = game.func
	let save = game.save
	let other = game.other
	
	let customScreens = ["importScreen", "resetScreen", "offlineTickScreen"]
	let nameOfSeperator = ["Commas", "Quotes", "Underscore"]
	
	customScreens.forEach(function(customScreen, order){
		id(customScreen).display = true
		
		other.screens[customScreen] = {
			display: false,
			mousedown: false,
			refX: 0,
			refY: 0,
			x: (document.body.clientWidth - id(customScreen).clientWidth - 4) / 2,
			y: (document.body.clientHeight - id(customScreen).clientHeight - 4) / 2,
		}
		
		id(customScreen).display = false
	})
	
	try {
		if (localStorage.getItem("infinite_nerf") === null) reset()
		implort(localStorage.getItem("infinite_nerf"))
	} catch {
		id("saveErrorScreen").display = true
		tab(1, 0)
		tab(4)
		return console.error("Uh oh! Your save file has become invalid!")
	}
	
	id("utab_0").display = false
	implort(explort())
	tick()
	tab(1, 0)
	tab(4)
	other.loading = false
	
	setInterval(tick, 20)
	setInterval(saveGame, 5000)
	
	customScreens = other.screens
	
	id("toggleInfinitySymbol").html = "Infinity Symbol: " + (game.save.options.infinitySymbol ? "ON" : "OFF")
	id("switchDigitSeperator").html = "Digit Seperator: " + nameOfSeperator[game.save.options.digitSeperator]
	
	body.onmousedown = function(event) {
		let originalTargetId = event.explicitOriginalTarget?.id
		let isNotScreenHead = true
		
		if (originalTargetId === "offlineTickScreenHead") isNotScreenHead = false
		if (originalTargetId === "importScreenHead") isNotScreenHead = false
		if (originalTargetId === "resetScreenHead") isNotScreenHead = false
		
		if (isNotScreenHead) return
		
		customScreens[originalTargetId.replace(/(Head)/, '')].mousedown = true
		
		for (let data in customScreens) {
			let customScreen = customScreens[data]
			customScreen.refX = event.clientX - customScreen.x
			customScreen.refY = event.clientY - customScreen.y
		}
	}
	
	body.onmouseup = function(event) {
		for (let data in customScreens) {
			customScreens[data].mousedown = false
		}
	}
	
	body.onmousemove = function(event) {
		for (let data in customScreens) {
			let customScreen = customScreens[data]
			
			if (customScreen.mousedown && customScreen.display) {
				customScreen.x = event.clientX - customScreen.refX
				customScreen.y = event.clientY - customScreen.refY
			}
			
			customScreen.x = Math.max(Math.min(customScreen.x, document.body.clientWidth - id(data).clientWidth - 4), 0)
			customScreen.y = Math.max(Math.min(customScreen.y, document.body.clientHeight - id(data).clientHeight - 4), 0)
		}
	}
	
	body.ontouchmove = function(event) {
		body.onmousemove(event.touches[0])
	}
	
	id("importedFile").onchange = function(event) {
		let files = id("importedFile").files
		let file = files[0]
		
		if (files.length === 1) {
			fileReader.onload = function(){
				let result = fileReader.result
				id("importedFileStat").html = file.name + " - " + file.size + " bytes"
				
				try {
					implort(result)
					id("importedFileStat").html += "<br>Import Successful!"
				} catch {
					id("importedFileStat").html += "<br>Import Failed!"
				}
			}
			
			fileReader.readAsText(file)
		} else if (files.length < 1) {
			id("importedFileStat").html = "No file selected."
		} else if (files.length > 1) {
			id("importedFileStat").html = "Too many files selected."
		} else {
			id("importedFileStat").html = "The file data is corrupted."
		}
	}
}

init()