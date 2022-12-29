const ON = OmegaNum

const id = function(id) {
	let x = document.getElementById(id)
	
	x.html = function(html) {
		x.innerHTML = html
	}
	
	x.display = function(display) {
		x.style.display = display ? "":"none"
	}
	
	return x
}

const game = {
	save: {},
	tick: {},
	tmp: {},
	func: {},
	start: {
		point: ON(0),
		tuon: ON(0),
		dilater: ON(0),
		compress: ON(0),
		timePassed: ON(0),
		limit: ON(0),
		limitUnlock: false,
		limUp: [false, false, false, false],
		lastTick: Date.now(),
		diff: 0,
		timePlayed: 0,
		options: {
			infinitySymbol: true,
			theme: "light"
		}
	},
	other: {
		loading: true,
		saveError: false,
		randomMsg: [
			"This game is about long timewalls. Why are you even playing this?",
			"Yes! I just got an infinitesimally small amount of points",
			"This game makes me appreciate that I atleast get some tangible quantity",
			"TUONS ARE THE DUMBEST CRAP EVER! WHO GIVES A FRICK ABOUT THEM - Tuon Hater",
			"NO! INFLATION IS EATING ME ALIVE! I was used to the slowness",
			"Having one point is an accomplishment in this game",
			"Dilation? More like... uh... I don't have a funny joke",
			"Compressors compress time, so wouldn't it make the Production Cap smaller?"
		],
		importScreen: {
			display: false,
			mousedown: false,
			x: 0,
			y: 0,
		},
		resetScreen: {
			display: false,
			mousedown: false,
			x: 0,
			y: 0,
		}
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
		
		if (x.eq(0)) {
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
				let y = x.mod(1e3).floor().toString()
				return x.div(1e3).floor() + "," + "0".repeat(3-y.length) + y
			}
		} else {
			let y = ON(10).pow(x.log10().floor())
			return x.div(y).floor() + "." + x.div(y).mul(10).floor().mod(10) + x.div(y).mul(100).floor().mod(10) + "e" + y.log10()
		}
	},
	
	whole(number) {
		let x = ON(number)
		if (x.eq(0)) return "0"
		if (x.lt(1e3)) return String(x.floor())
		return format.normal(x)
	},
	
	time(second) {
		return time(ON(second), 2)	
			
		function time(x, y) {
			let z = ''
			
			if (x.lte(0)) return ''
			else if (x.lt(1) && y < 2) z = " and "
			else if (y < 2) z = ", "
			
			if (y > 0) {
				if (x.lt(1)) z += format.normal(x.mul(1000)) + " milliseconds"
				else if (x.lt(60)) z += format.whole(x) + " second" + (x.floor().eq(1) ? "":"s") + time(x.sub(x.floor()), y-1)
				else if (x.lt(3600)) z += format.whole(x.div(60)) + " minute" + (x.div(60).floor().eq(1) ? "":"s") + time(x.sub(x.div(60).floor().mul(60)), y-1)
				else if (x.lt(86400)) z += format.whole(x.div(3600)) + " hour" + (x.div(3600).floor().eq(1) ? "":"s") + time(x.sub(x.div(3600).floor().mul(3600), y-1))
				else z += format.whole(x.div(86400)) + " day" + (x.div(86400).floor().eq(1) ? "":"s") + time(x.sub(x.div(86400).floor().mul(86400), y-1))
				return z
			} else {
				if (x.lt(1)) return z + format.normal(x.mul(1000)) + " milliseconds"
				if (x.lt(60)) return z + format.normal(x) + " second" + (x.floor().eq(1) ? "":"s")
				if (x.lt(3600)) return z + format.normal(x.div(60)) + " minute" + (x.div(60).floor().eq(1) ? "":"s")
				if (x.lt(86400)) return z + format.normal(x.div(3600)) + " hour" + (x.div(3600).floor().eq(1) ? "":"s")
				return z + format.normal(x.div(86400)) + " day" + (x.div(86400).floor().eq(1) ? "":"s")
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
		return time(ON(second), 2)	
		
		function time(x, y) {
			let z = ''
			
			if (x.lte(0)) return ''
			else if (x.lt(1) && y < 2) z = " and "
			else if (y < 2) z = ", "
			
			if (y > 0) {
				if (x.lt(1)) z += format.total(x.mul(1000)) + " milliseconds"
				else if (x.lt(60)) z += format.whole(x) + " second" + (x.floor().eq(1) ? "":"s") + time(x.sub(x.floor()), y-1)
				else if (x.lt(3600)) z += format.whole(x.div(60)) + " minute" + (x.div(60).floor().eq(1) ? "":"s") + time(x.sub(x.div(60).floor().mul(60)), y-1)
				else if (x.lt(86400)) z += format.whole(x.div(3600)) + " hour" + (x.div(3600).floor().eq(1) ? "":"s") + time(x.sub(x.div(3600).floor().mul(3600), y-1))
				else z += format.whole(x.div(86400)) + " day" + (x.div(86400).floor().eq(1) ? "":"s") + time(x.sub(x.div(86400).floor().mul(86400), y-1))
				return z
			} else {
				if (x.lt(1)) return z + format.total(x.mul(1000)) + " milliseconds"
				if (x.lt(60)) return z + format.total(x) + " second" + (x.floor().eq(1) ? "":"s")
				if (x.lt(3600)) return z + format.total(x.div(60)) + " minute" + (x.div(60).floor().eq(1) ? "":"s")
				if (x.lt(86400)) return z + format.total(x.div(3600)) + " hour" + (x.div(3600).floor().eq(1) ? "":"s")
				return z + format.total(x.div(86400)) + " day" + (x.div(86400).floor().eq(1) ? "":"s")
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
	for (let i = 0; i < amt; i++) id("utab_" + i).display(0)
	id("utab_" + up).display(1)
	update("random_message")
	
	if (!isNaN(sub)) {
		let amt = id("utab_" + up).children.length
		let a = 0
		for (let i = 0; i < amt; i++) {
			if (id("utab_" + up).children[i].id.includes("stab")) {
				id("stab_" + up + "-" + a).display(0)
				a++
			}
		}
		id("stab_" + up + "-" + sub).display(1)
	}
}

const cursor = function(elm, req) {
	elm.style.cursor = req ? "pointer" : "default"
	elm.classList[req ? "add" : "remove"]("buttonHover")
}

const reset = function() {
	game.save = [game.start][0]
	implort(explort())
}

const implort = function(save) {
	if (save.substr(0, 2) != "ey") {
		alert("Uh oh! There is an error with your save file. We will be trying to fix it")
		return
	}
	
	save = JSON.parse(atob(save.slice(2)).split('').reverse().join(''))
	setObject(save, game.start)
	
	save.lastTick = Date.now()
	game.save = save
	
	localStorage.setItem("infinite_nerf", explort())
	
	function setObject(x, s) {
		for (item in s) {
			if (s[item] instanceof ON) {
				x[item] = ON(x[item])
				if (x[item].isNaN()) {
					if (!game.other.saveError) {
						alert("Uh oh! There is an error with your save file. We will be trying to fix it")
						console.log(item)
						game.other.saveError = true
					}
					
					x[item] = ON(s[item])
				}
			} else if (x[item] == undefined) x[item] = s[item]
			else if (typeof x[item] == "object") setObject(x[item], s[item])
		}
	}
}

const explort = function() {
	let x = {}
	let s = game.start
	
	for (item in s) {
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

game.tmp = {
	limUpCosts: [ON(1), ON(1), ON(1), ON(3), ON(2), ON(2), ON(2)]
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
		id("toggleInfinitySymbol").html("Infinity Symbol: " + (game.save.options.infinitySymbol ? "ON" : "OFF"))
	},
	prestige(id) {
		if (id == 0 && game.save.point.gte(game.tmp.dilaterCost)) {
			game.func.reset(0)
			game.save.dilater = game.save.dilater.add(1)
		} else if (id == 1 && game.save.dilater.gte(game.tmp.compCost)) {
			game.func.reset(1)
			game.save.compress = game.save.compress.add(1)
		} else if (id == 2 && game.save.point.gte(5)) {
			game.save.limit = game.save.limit.add(game.func.getPrestige(2))
			game.func.reset(2)
		}
	},
	getPrestigeGain(id) {
		if (id < 2) return ON(0)
		
		if (id == 2) {
			let gain = game.save.point.sub(4)
			if (gain.gt(5)) gain = gain.mul(5).add(1).sqrt()
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
			let gain = getPrestigeGain(2)
			if (gain.gt(5)) return gain.pow(2).sub(1).div(5)
			return gain.add(4)
		}
	},
	getPrestigeNextReq(id) {
		if (id == 0) return
		if (id == 1) return
		
		if (id == 2) {
			let gain = getPrestigeGain(2).add(1)
			if (gain.gt(5)) return gain.pow(2).sub(1).div(5)
			return gain.add(4)
		}
	},
	getLimUp(id) {
		if (game.save.limit.gte(game.tmp.limUpCosts[id]) && !game.save.limUp[id]) {
			game.save.limit = game.save.limit.sub(game.tmp.limUpCosts[id])
			game.save.limUp[id] = true
		}
	}
}

game.tick = {
	tuonEff() {
		let eff = game.save.tuon.add(1).sqrt()
		if (game.save.limUp[1]) eff = eff.root(1.5)
		return eff
	},
	tuonGain() {
		return game.save.tuon.pow(0.85).add(1).mul(game.tmp.time)
	},
	freeDilater() {
		let free = ON(0)
		if (game.save.limUp[0]) free = free.add(16)
		return free
	},
	dilaterCost() {
		return game.func.getPrestigeReq(0)
	},
	dilaterEff() {
		let eff = game.save.dilater.add(game.tmp.freeDilater).mul(game.tmp.compEff2).max(0)
		if (game.save.limUp[2]) eff = eff.mul(2)
		if (game.save.limUp[4]) eff = eff.mul(2)
		if (eff.gt(16)) eff = eff.sqrt().mul(4)
		return eff
	},
	freeComp() {
		let free = ON(0)
		if (game.save.limUp[6]) free = free.add(1)
		return free
	},
	compCost() {
		return game.func.getPrestigeReq(1)
	},
	compEff1() {
		let eff = game.save.compress.add(game.tmp.freeComp)
		if (eff.gte(16)) eff = eff.add(eff.sqrt().mul(4))
		else eff = eff.mul(2)
		if (game.save.limUp[3]) eff = eff.mul(game.tmp.limitEff)
		if (game.save.limUp[5]) eff = eff.mul(1.1)
		return eff
	},
	compEff2() {
		return game.save.compress.add(game.tmp.freeComp).sqrt()
	},
	limitEff() {
		let eff = game.save.limit.add(1).sqrt()
		if (eff.gt(4)) eff = eff.logBase(2).mul(2)
		return eff.sqrt()
	},
	time() {
		let time = game.tmp.dilaterEff.mul(game.tmp.limitEff).div(game.tmp.tuonEff).div(1024)
		return time
	},
	timeCap() {
		return game.tmp.compEff1
	},
	pointGain() {
		let gain = game.tmp.time
		if (gain.gt(1)) gain = gain.sqrt()
		return gain
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
		id("randomMsg").html(msg[random])
	} else if (type == "tmp") {
		updateTmp(5)
		
		function updateTmp(x) {
			if (x < 1) return
			for (item in game.tick) game.tmp[item] = game.tick[item]()
			updateTmp(x-1)
		}
	}
}

const tick = function() {
	let save = game.save
	let tmp = game.tmp
	let other = game.other
	
	save.diff += Date.now()-save.lastTick
	let takeTick = Math.max(Math.ceil(save.diff/10), 50)
	if (save.diff-takeTick < 0) takeTick = save.diff
	save.lastTick = Date.now()
	save.diff -= takeTick
	let diff = ON(takeTick).div(1e3)
	
	// Updating variables
	
	update("tmp")
	if (game.save.point.gte(5)) game.save.limitUnlock = true
	
	other.importScreen.x = Math.max(Math.min(other.importScreen.x, document.body.clientWidth-id("importScreen").clientWidth-4), 0)
	other.importScreen.y = Math.max(Math.min(other.importScreen.y, document.body.clientHeight-id("importScreen").clientHeight-4), 0)
	other.resetScreen.x = Math.max(Math.min(other.resetScreen.x, document.body.clientWidth-id("resetScreen").clientWidth-4), 0)
	other.resetScreen.y = Math.max(Math.min(other.resetScreen.y, document.body.clientHeight-id("resetScreen").clientHeight-4), 0)
	
	// Production
	
	if (save.timePassed.lt(tmp.timeCap)) {
		save.point = save.point.add(tmp.pointGain.mul(diff))
		save.point = ON.pow(0.9,tmp.time.mul(diff)).mul(save.point)
		save.tuon = save.tuon.add(tmp.tuonGain.mul(diff))
	}
	
	save.timePlayed += diff.toNumber()
	save.timePassed = save.timePassed.add(tmp.time.mul(diff))
	
	// Display part
	tmp.pointGain = tmp.pointGain.sub(ON.pow(0.9,tmp.time).neg().add(1).mul(save.point.div(100)))
	
	tagHTML("infinity_symbol", save.options.infinitySymbol ? "∞":"Infinity")
	
	tagHTML("point", format.infismall(save.point))
	tagHTML("pointGain", format.infismall(tmp.pointGain))
	tagHTML("tuon", format.normal(save.tuon))
	tagHTML("tuonEffect", format.normal(tmp.tuonEff))
	tagHTML("tuonGain", format.normal(tmp.tuonGain))
	tagHTML("dilater", format.total(save.dilater) + (tmp.freeDilater.gt(0) ? ("+" + format.total(tmp.freeDilater)):"") + " dilater" + (save.dilater.add(tmp.freeDilater).eq(1) ? "":"s"))
	tagHTML("dilaterEffect", format.total(tmp.dilaterEff))
	tagHTML("compress", save.compress + (tmp.freeComp.gt(0) ? ("+" + format.total(tmp.freeComp)):"") + " compressor" + (save.compress.eq(1) ? "":"s"))
	tagHTML("compressEffect1", format.time(tmp.compEff1))
	tagHTML("compressEffect2", format.total(tmp.compEff2))
	tagHTML("limit", format.total(save.limit))
	
	id("loadScreen").display(0)
	id("headerButton").display(1)
	if (other.loading) id("utab_0").display(1)
	
	id("importScreen").style.transform = `translate(${other.importScreen.x}px, ${other.importScreen.y}px)`
	id("importScreen").display(other.importScreen.display)
	id("resetScreen").style.transform = `translate(${other.resetScreen.x}px, ${other.resetScreen.y}px)`
	id("resetScreen").display(other.resetScreen.display)
	
	if (other.importScreen.mousedown) id("importScreen").style.cursor = "grabbing"
	else id("importScreen").style.cursor = "grab"
	if (other.resetScreen.mousedown) id("resetScreen").style.cursor = "grabbing"
	else id("resetScreen").style.cursor = "grab"
	
	id("statPointEquivalent").html("If every point were a liter of water, you would have enough to fill " + format.totalInf(save.point.mul(4)) + " cups")
	id("statTimePlayed").html(format.totalTime(save.timePlayed))
	
	id("dilaterCost").html("Req: " + format.totalInf(tmp.dilaterCost) + " points")
	id("compCost").html("Req: " + format.total(tmp.compCost) + " dilater" + (tmp.compCost.eq(1) ? "":"s"))
	id("timePassed").html(format.time(save.timePassed))
	id("timePassedMax").html(save.timePassed.lt(tmp.timeCap) ? "":" (maxed out)")
	id("fxProdCap").html(`Production is only ${format.total(tmp.timeCap)} second` + (tmp.timeCap.eq(1) ? "":"s") + " long")
	id("limitTabButton").html(save.limitUnlock ? "Limit":"???")
	id("limitPrestigeText").html(save.point.lte(5) ? "Req: 5ε points" : `Reset for ${format.whole(game.func.getPrestige(2))} limit` + (game.func.getPrestige(2).eq(1) ? "":"s"))
	id("limitEff").html("")
	if (save.limUp[3]) id("limitEff").html(`, multiplying the Compressor Effect by ${format.normal(tmp.limitEff)}`)
	
	id("stab_5-0").display(!save.limitUnlock)
	id("stab_5-1").display(save.limitUnlock)
	
	cursor(id("dilaterUpg"), game.save.point.gte(game.tmp.dilaterCost))
	cursor(id("compressUpg"), game.save.dilater.gte(game.tmp.compCost))
	cursor(id("limitPrestige"), game.save.point.gte(5))
	
	if (tmp.time.lte(0)) id("fxTime").html("Time is halted relative to real-time")
	else if (tmp.time.lt(1)) id("fxTime").html(`Time is ${format.normal(ON(1).div(tmp.time))}x slower than real-time`)
	else id("fxTime").html(`Time is ${format.normal(tmp.time)}x faster than real-time`)
	
	update("theme_button")
	
	id("styleMode").href = save.options.theme + ".css"
	
	for (let i = 0; i < 7; i++) {
		cursor(document.getElementsByClassName("upgrade")[i], game.save.limit.gte(game.save.limUp[i]))
		id("limUpReq" + i).html(game.save.limUp[i] ? "Purchased":"Cost: " + format.whole(tmp.limUpCosts[i]))
	}
	
	function tagHTML(x, y) {
		let z = document.getElementsByClassName("update " + x)
		for (let i = 0; i < z.length; i++) z[i].innerHTML = y
	}
}

const init = function() {
	let body = document.body
	let save = game.save
	let tmp = game.tmp
	let other = game.other
	
	try {
		implort(localStorage.getItem("infinite_nerf"))
	} catch {
		Error("Invalid Import")
		reset()
	}
	
	id("utab_0").display(0)
	implort(explort())
	tick()
	tab(1, 0)
	tab(4)
	other.loading = false
	
	body.onmousedown = function(event) {
		let originalTargetId = event.explicitOriginalTarget.id
		if (originalTargetId != "importScreen" && originalTargetId != "resetScreen") return
		other[originalTargetId].mousedown = true
	}
	
	body.onmouseup = function(event) {
		other.importScreen.mousedown = false
		other.resetScreen.mousedown = false
	}
	
	body.onmousemove = function(event) {
		if (other.importScreen.mousedown && other.importScreen.display) {
			other.importScreen.x += event.movementX
			other.importScreen.y += event.movementY
		} else if (other.resetScreen.mousedown && other.resetScreen.display) {
			other.resetScreen.x += event.movementX
			other.resetScreen.y += event.movementY
		}
	}
	
	setInterval(tick, 20)
	setInterval(function(){implort(explort())}, 5000)
}

init()