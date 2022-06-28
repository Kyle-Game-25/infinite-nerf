/*
	Here are the scripts that run before the html loads
	Usually contains functions or variables
*/

ON = OmegaNum

function id(id) {
	var x = document.getElementById(id)
	
	x.html = (html) => {
		x.innerHTML = html
	}
	
	return x
}

var game = {
	save: {},
	tick: {},
	func: {},
	vars: [
		"point",
		"tuon",
		"dilater",
		"compress",
		"timePassed",
		"limit"
	]
}

var format = {
	infismall(x) {
		var x = ON(x)
		var y = ON(10).pow(x.log10().floor())
		var z = 0
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
		var x = ON(x)
		var y = ON(10).pow(x.log10().floor())
		var z
		if (x.lt(1e3)) {
			z = x.floor() + "." + x.mul(10).floor().mod(10) + x.mul(100).floor().mod(10)
		} else {
			z = x.div(y).floor() + "." + x.div(y).mul(10).floor().mod(10) + x.div(y).mul(100).floor().mod(10) + "e" + y.log10()
		}
		return z
	},
	
	time(x) {
		var x = ON(x)
		var y
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
		return x.mul(100).floor().div(100)
	},
	
	totalInf(x) {
		var x = ON(x)
		var y = ON(10).pow(x.log10().floor())
		var z = 0
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

function tab(up,sub) {
	id("utab0").style.display = "none"
	id("utab1").style.display = "none"
	id("utab2").style.display = "none"
	id("utab3").style.display = "none"
	id("utab" + up).style.display = ""
}

function cursor(id,req) {
	document.getElementById(id).style.cursor = req ? "pointer":"default"
}

function reset(x) {
	var y = {
		point: ON(0),
		tuon: ON(0),
		dilater: ON(0),
		compress: ON(0),
		timePassed: ON(0),
		limit: ON(0),
		limUp: [false, false, false, false],
		lastTick: Date.now(),
		diff: 0
	}
	if (x) {
		return y
	} else {
		game.save = y
	}
	
	implort(explort())
}

function implort(save) {
	var x = JSON.parse(atob(save))
	
	for (let i = 0; i < game.vars.length; i++) {
		if (x[game.vars[i]] == undefined || x[game.vars[i]] == NaN) {
			alert("Uh oh! There is an error with your save file. We will be trying to fix it")
			x[game.vars[i]] = reset(1)[game.vars[i]]
		}
		x[game.vars[i]] = ON(x[game.vars[i]])
	}
	
	x.lastTick = Date.now()
	game.save = x
	
	localStorage.setItem("infinite_nerf",explort())
}

explort = () => btoa(JSON.stringify(game.save))

game.func.getDilater = () => {
	if (game.save.point.gte(game.tick.dilaterCost)) {
		game.save.point = ON(0)
		game.save.tuon = ON(0)
		game.save.timePassed = ON(0)
		game.save.dilater = game.save.dilater.add(1)
	}
}

game.func.getComp = () => {
	if (game.save.dilater.gte(game.tick.compCost)) {
		game.save.point = ON(0)
		game.save.tuon = ON(0)
		game.save.timePassed = ON(0)
		game.save.dilater = ON(0)
		game.save.compress = game.save.compress.add(1)
	}
}

game.func.getLimUp = (id) => {
	var a = [ON(1),ON(1),ON(1),ON(3)]
	if (game.save.limit.gte(a[id]) && !game.save.limUp[id]) {
		game.save.limit = game.save.limit.sub(a[id])
		game.save.limUp[id] = true
	}
}

if (localStorage.getItem("infinite_nerf") == null) reset()
implort(localStorage.getItem("infinite_nerf"))