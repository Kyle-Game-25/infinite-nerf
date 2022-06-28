/*
	Here are the scripts that run after the html loads
	Usually updating elements or variables
*/

tab(0)
implort(explort())

setInterval(function(){
	var save = game.save
	var tick = game.tick
	
	save.diff = Date.now()-save.lastTick
	save.lastTick = Date.now()
	
	var diff = ON(save.diff).div(1e3)
	
	// Updating variables
	
	tick.tuonEffect = save.tuon.cbrt().mul(2).add(1)
	if (save.limUp[1]) tick.tuonEffect = tick.tuonEffect.root(1.5)
	
	tick.freeDilater = ON(0)
	if (save.limUp[0]) tick.freeDilater = tick.freeDilater.add(save.compress)
	
	tick.dilaterCost = ON.pow(2, save.dilater.div(8)).sub(1).ceil()
	tick.compCost = save.compress.add(1).pow(2)
	
	tick.dilaterEffect = save.dilater.add(tick.freeDilater)
	if (tick.dilaterEffect.gt(4)) tick.dilaterEffect = tick.dilaterEffect.mul(4).sqrt()
	
	tick.compEffect = save.compress.mul(2)
	
	tick.limitEffect = save.limit.add(1).sqrt()
	if (tick.limitEffect.gt(4)) tick.limitEffect = tick.limitEffect.log2().mul(2)
	
	tick.pointMult = tick.limitEffect
	
	tick.time = tick.dilaterEffect.div(tick.tuonEffect).div(128)
	if (save.limUp[2]) tick.time = tick.time.mul(2)
	tick.timeCap = tick.compEffect
	
	tick.pointGain = tick.time.mul(tick.pointMult)
	tick.tuonGain = save.tuon.add(1).mul(4).mul(tick.time)
	
	// Production
	
	if (save.timePassed.lt(tick.timeCap)) {
		save.point = save.point.add(tick.pointGain.mul(diff))
		save.point = save.point.mul(ON.pow(0.9,tick.time.mul(diff)))
		save.tuon = save.tuon.add(tick.tuonGain.mul(diff))
	}
	
	save.timePassed = save.timePassed.add(tick.time.mul(diff))
	
	// Display part
	
	id("dilater").html("You have " + format.total(save.dilater) + (tick.freeDilater.gt(0) ? ("+" + format.total(tick.freeDilater)):"") +
	" dilater" + (save.dilater.eq(1) ? "":"s") + " multiplying Time Speed by " + format.normal(tick.dilaterEffect))
	id("compress").html("You have " + save.compress + " compressor" + (save.compress.eq(1) ? "":"s") +
	" increasing the Production Cap by " + format.time(tick.compEffect))
	id("dilaterCost").html("Req: " + format.totalInf(tick.dilaterCost) + " points")
	id("compCost").html("Req: " + format.total(tick.compCost) + " dilater" + (save.dilater.eq(1) ? "":"s"))
	
	id("points").html("You have " + format.infismall(save.point) + " points")
	id("pointGain").html("You are gaining " + format.infismall(tick.pointGain) + " points per real-life second")
	id("tuons").html("You have " + format.normal(save.tuon) + " tuons dividing Time Speed by " + format.normal(tick.tuonEffect))
	id("tuonGain").html("You are gaining " + format.normal(tick.tuonGain) + " tuons per real-life second")
	id("timePassed").html(format.time(save.timePassed) + " have passed" + (save.timePassed.lt(tick.timeCap) ? "":" (maxed out)"))
	id("fxPointMult").html("Point Production is then multiplied by " + format.normal(tick.pointMult))
	id("fxProcap").html("Production is only " + format.total(tick.timeCap) + " second" + (tick.timeCap.eq(1) ? "":"s") + " long")
	id("infismall").html("You have " + format.total(save.limit) + " limits" +
	(save.limUp[3] ? " multiplying Point Gain by " + format.normal(tick.limitEffect):""))
	id("limUpReq0").html(game.save.limUp[0] ? "Purchased":"Cost: 1")
	id("limUpReq1").html(game.save.limUp[1] ? "Purchased":"Cost: 1")
	id("limUpReq2").html(game.save.limUp[2] ? "Purchased":"Cost: 1")
	id("limUpReq3").html(game.save.limUp[3] ? "Purchased":"Cost: 3")
	
	cursor("dilaterUpg",game.save.point.gte(game.tick.dilaterCost))
	cursor("compressUpg",game.save.dilater.gte(game.tick.compCost))
	
	if (tick.time.lte(0)) {
		id("fxTime").html("Time is halted relative to real-time")
	} else if (tick.time.lt(1)) {
		id("fxTime").html("Time is " + format.total(ON(1).div(tick.time)) + "x slower than real-time")
	} else {
		id("fxTime").html("Time is " + format.total(tick.time) + "x faster than real-time")
	}
},20)

setInterval(function(){
	implort(explort())
},5000)