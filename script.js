/*
	Here is the total script
	It is very unorganized
*/

let body = document.body

const ON = OmegaNum

const id = function(id) {
	let x = document.getElementById(id)
	
	x.html = function(html) {
		x.innerHTML = html
	}
	
	return x
}

const game = {
	save: {},
	tick: {},
	tmp: {},
	func: {},
	vars: [
		"point",
		"tuon",
		"dilater",
		"compress",
		"timePassed",
		"limit"
	],
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
		diff: 0
	},
	other: {
		loading: true
	},
}

const format = {
	infismall(x) {
		x = ON(x)
		let y = ON(10).pow(x.log10().floor())
		let z = 0
		
		if (x.lte(0)) {
		} else if (x.eq(1)) {
			z = "ε"
		} else if (x.lt(1e308)) {
			z = format.normal(x) + "ε"
		} else {
			z = format.normal(x.div(1e308).cbrt())
		}
		return z + ''
	},
	
	normal(x) {
		x = ON(x)
		let y = ON(10).pow(x.log10().floor())
		let z = 0
		
		if (x.eq(0)) {
		} else if (x.lt(0.02)) {
			z = "0.0" + x.mul(100).floor().mod(10) + x.mul(1e3).floor().mod(10) + x.mul(1e4).floor().mod(10)
		} else if (x.lt(1e3)) {
			z = x.floor() + "." + x.mul(10).floor().mod(10) + x.mul(100).floor().mod(10)
		} else {
			z = x.div(y).floor() + "." + x.div(y).mul(10).floor().mod(10) + x.div(y).mul(100).floor().mod(10) + "e" + y.log10()
		}
		return z
	},
	
	whole(x) {
		x = ON(x)
		
		if (x.eq(0)) {
			return "0"
		} else if (x.lt(1e3)) {
			return x.floor() + ''
		} else {
			return format.normal(x)
		}
	},
	
	time(x) {
		x = ON(x)
		let y
		
		if (x.lt(1)) {
			y = x.mul(1e3).floor() + "." + x.mul(1e4).floor().mod(10) + x.mul(1e5).floor().mod(10) + " milliseconds"
		} else if (x.lt(60)) {
			y = x.floor() + "." + x.mul(10).floor().mod(10) + x.mul(100).floor().mod(10) + " seconds"
		} else if (x.lt(3600)) {
			y = x.div(60).floor() + "." + x.div(6).floor().mod(10) + x.mul(ON.div(5,3)).floor().mod(10) + " minutes"
		} else {
			y = x.div(3600).floor() + "." + x.div(360).floor().mod(10) + x.div(36).floor().mod(10) + " hours"
		}
		return y
	},
	
	total(x) {
		x = ON(x)
		
		if (x.lt(1e3)) return x.mul(100).floor().div(100)
		return format.normal(x)
	},
	
	totalInf(x) {
		x = ON(x)
		let y = ON(10).pow(x.log10().floor())
		let z = 0
		
		if (x.lte(0)) {
		} else if (x.eq(1)) {
			z = "ε"
		} else if (x.lt(1e308)) {
			z = format.total(x) + "ε"
		} else {
			z = format.total(x.div(1e308).cbrt())
		}
		return z + ''
	}
}

const tab = function(up,sub) {
	id("utab0").style.display = "none"
	id("utab1").style.display = "none"
	id("utab2").style.display = "none"
	id("utab3").style.display = "none"
	id("utab4").style.display = "none"
	id("utab" + up).style.display = ""
}

const cursor = function(id,req) {
	document.getElementById(id).style.cursor = req ? "pointer" : "default"
	document.getElementById(id).classList[req ? "add" : "remove"]("buttonHover")
}

const reset = function() {
	game.save = game.start
	implort(explort())
}

const implort = function(save) {
	let x = save.split('')
	
	if (x[0] == "e" && x[1] == "y") {
		x.shift()
		x.shift()
		x = JSON.parse(atob(x.join('')).split('').reverse().join(''))
		
		let s = game.start
		let t = 1
		
		for (item in s) {
			if (s[item].array == undefined) {
				if (x[item] == undefined) x[item] = s[item]
			} else {
				if (x[item] == undefined || x[item] == NaN) {
					if (t) alert("Uh oh! There is an error with your save file. We will be trying to fix it")
					if (t) t = 0
					
					x[item] = s[item]
				} else {
					x[item] = ON(x[item])
				}
			}
		}
		
		x.lastTick = Date.now()
		game.save = x
		
		localStorage.setItem("infinite_nerf",explort())
	} else {
		reset()
	}
}

const explort = function() {
	return "ey" + btoa(JSON.stringify(game.save).split('').reverse().join(''))
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
	getPrestige(id) {
		if (id < 2) return ON(0)
		
		if (id == 2) {
			let gain = game.save.point.sub(4)
			if (gain.gt(5)) gain = gain.mul(5).add(1).sqrt()
			return gain.floor()
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
	freeDilater() {
		let d = game.save.compress.add(game.tick.freeComp())
		if (game.save.limUp[0]) d = d.add(4)
		return d
	},
	dilaterCost() {
		let cost = ON.pow(2, game.save.dilater.sub(1).div(8))
		if (game.save.dilater.lte(0)) cost = ON(0)
		return cost
	},
	dilaterEff() {
		let eff = game.save.dilater.add(game.tick.freeDilater()).sub(1).max(0)
		if (game.save.limUp[5]) eff = eff.mul(2)
		if (eff.gt(16)) eff = eff.sqrt().mul(4)
		return eff
	},
	freeComp() {
		let c = ON(0)
		if (game.save.limUp[6]) c = c.add(1)
		return c
	},
	compCost() {
		return game.save.compress.add(1).pow(2)
	},
	compEff() {
		let eff = game.save.compress.add(game.tick.freeComp())
		eff = eff.add(eff.gte(16) ? eff.sqrt().mul(4) : eff)
		if (game.save.limUp[3]) eff = eff.mul(game.tick.limitEff())
		return eff
	},
	limitEff() {
		let eff = game.save.limit.add(1).sqrt()
		if (eff.gt(4)) eff = eff.logBase(2).mul(2)
		return eff.sqrt()
	},
	time() {
		let time = game.tick.dilaterEff().mul(game.tick.limitEff()).div(game.tick.tuonEff()).div(256)
		if (game.save.limUp[2]) time = time.mul(2)
		if (game.save.limUp[4]) time = time.mul(2)
		return time
	},
	timeCap() {
		return game.tick.compEff()
	},
	pointGain() {
		return game.tick.time()
	},
	tuonEff() {
		let eff = game.save.tuon.add(1).root(2.5)
		if (game.save.limUp[1]) eff = eff.root(1.5)
		return eff
	},
	tuonGain() {
		return game.save.tuon.pow(0.85).add(1).mul(game.tick.time())
	}
}

const tick = function() {
	let save = game.save
	let tmp = game.tmp
	let other = game.other
	
	save.diff = Date.now()-save.lastTick
	save.lastTick = Date.now()
	
	let diff = ON(save.diff).div(1e3).min(60)
	
	// Updating variables
	
	for (item in game.tick) {
		tmp[item] = game.tick[item]()
	}
	
	if (game.save.point.gte(5)) game.save.limitUnlock = true
	
	// Production
	
	if (save.timePassed.lt(tmp.timeCap)) {
		save.point = save.point.add(tmp.pointGain.mul(diff))
		save.point = ON.pow(0.9,tmp.time.mul(diff)).mul(save.point)
		save.tuon = save.tuon.add(tmp.tuonGain.mul(diff))
	}
	
	save.timePassed = save.timePassed.add(tmp.time.mul(diff))
	
	// Display part
	tmp.pointGain = tmp.pointGain.sub(ON.pow(0.9,tmp.time).neg().add(1).mul(save.point.div(100)))
	
	tagHTML("point", format.infismall(save.point))
	tagHTML("pointGain", format.infismall(tmp.pointGain))
	tagHTML("tuon", format.normal(save.tuon))
	tagHTML("tuonEffect", format.normal(tmp.tuonEff))
	tagHTML("tuonGain", format.normal(tmp.tuonGain))
	tagHTML("dilater", format.total(save.dilater) + (tmp.freeDilater.gt(0) ? ("+" + format.total(tmp.freeDilater)):"") + " dilater" + (save.dilater.add(tmp.freeDilater).eq(1) ? "":"s"))
	tagHTML("dilaterEffect", save.dilater.add(tmp.freeDilater).eq(1) ? "ε":format.total(tmp.dilaterEff))
	tagHTML("compress", save.compress + (tmp.freeComp.gt(0) ? ("+" + format.total(tmp.freeComp)):"") + " compressor" + (save.compress.eq(1) ? "":"s"))
	tagHTML("compressEffect", format.time(tmp.compEff))
	tagHTML("limit", format.total(save.limit))
	
	id("loadScreen").style.display = "none"
	id("headerButton").style.display = ""
	if (other.loading) id("utab0").style.display = ""
	
	id("dilaterCost").html("Req: " + format.totalInf(tmp.dilaterCost) + " points")
	id("compCost").html("Req: " + format.total(tmp.compCost) + " dilater" + (save.dilater.eq(1) ? "":"s"))
	id("timePassed").html(format.time(save.timePassed))
	id("timePassedMax").html(save.timePassed.lt(tmp.timeCap) ? "":" (maxed out)")
	id("fxProcap").html("Production is only " + format.total(tmp.timeCap) + " second" + (tmp.timeCap.eq(1) ? "":"s") + " long")
	id("limitTabButton").html(save.limitUnlock ? "Limit":"???")
	id("limitPrestigeText").html(save.point.lte(5) ? "Req: 5ε points" : "Reset for " + format.whole(game.func.getPrestige(2)) + " limit" + (game.func.getPrestige(2).eq(1) ? "":"s"))
	id("limitEff").html(!save.limUp[3] ? "":", multiplying the Compressor Effect by " + format.normal(tmp.limitEff))
	
	id("stab40").style.display = ""
	id("stab41").style.display = "none"
	
	if (save.limitUnlock) {
		id("stab40").style.display = "none"
		id("stab41").style.display = ""
	}
	
	cursor("dilaterUpg", game.save.point.gte(game.tmp.dilaterCost))
	cursor("compressUpg", game.save.dilater.gte(game.tmp.compCost))
	cursor("limitPrestige", game.save.point.gte(5))
	
	if (tmp.time.lte(0)) {
		id("fxTime").html((save.dilater.add(tmp.freeDilater).eq(1) ? "Time is ∞x slower than real-time":"Time is halted relative") +
		" to real-time")
	} else if (tmp.time.lt(1)) {
		id("fxTime").html("Time is " + format.normal(ON(1).div(tmp.time)) + "x slower than real-time")
	} else {
		id("fxTime").html("Time is " + format.normal(tmp.time) + "x faster than real-time")
	}
	
	for (let i = 0; i < 7; i++) {
		id("limUpReq" + i).html(game.save.limUp[i] ? "Purchased":"Cost: " + format.whole(tmp.limUpCosts[i]))
	}
	
	function tagHTML(x, y) {
		let z = document.getElementsByClassName("_" + x + "_")
		
		for (let i = 0; i < z.length; i++) {
			z[i].innerHTML = y
		}
	}
}

if (localStorage.getItem("infinite_nerf") == undefined) reset()
implort(localStorage.getItem("infinite_nerf"))

tab(0)
id("utab0").style.display = "none"
implort(explort())
tick()
delete game.other.loading

setInterval(tick,20)

setInterval(function(){
	implort(explort())
},5000)