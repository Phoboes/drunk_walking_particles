var topBoundary = 0;
var bottomBoundary = 400;
var ctx;
var canvas;
var cells = [];


var makeModel = function( type, lifespan, speed, size, x, y, genes, color ){
	var model = {
		type: type,
		speed: speed,
		size: size,
		lifespan: lifespan,
		X: x,
		Y: y,
		genes: genes,
		color: color
	};
	// debugger
	modelRun( model );
	// return model
};

var modelRun = function( model ){
		// console.log("run")
		var lifeTime = setInterval(function(){
			// console.log("Tick.")
		if( model.lifespan > 0 ){
			clearPreviousIndex( model, ctx )
			drawModel( step( model ), ctx );
			model.lifespan --;
		} else {
			// console.log("Hit.")
			clearPreviousIndex( model, ctx );
			clearInterval( lifeTime );
			model = {};
		}
	}, 20)
}

var clearPreviousIndex = function( model, context ){
	context.clearRect(model.X, model.Y, model.size, model.size);
}

var drawModel = function( model, context ){
	ctx.fillStyle = model.color
	context.fillRect( model.X, model.Y, model.size, model.size );
};


var getRange = function( num, range ){
	var returnVal = Math.round(Math.random() * ( ( num + range )  -  ( num - range ) )) + ( num - range );
	// If canvas bounds are exceeded -- reroll
	while( returnVal > bottomBoundary || returnVal < topBoundary ){
		var next = getRange( num, range );
		if( next ){
			return next;
		} 
	}
	return returnVal;
};

var step = function( model ){
	model.X = getRange(model.X, model.size);
	model.Y = getRange(model.Y, model.size);
	return model;
}

var populate = function(num, template){
	for( var i = 0; i < num; i++ ){
		template.X = getRange( 0, bottomBoundary );
		template.Y = getRange( 0, bottomBoundary );
		template.lifespan = getRange(50, 400);
		template.color = getRandomColor();
		makeModel(  
				template.type, 
				template.lifespan,
				template.speed,
				template.size,
				template.X,
				template.Y,
				template.genbes,
				template.color
			);
	}
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

window.onload = function(){

canvas = document.querySelector('canvas');
ctx = canvas.getContext("2d");
templatePrey = { type: "prey", speed: 1, size: 2, genes: "Sf" };
// r2 = makeModel( "prey", 9000, 1, 4, 100, 300, "Sf", "blue" );
// r3 = makeModel( "prey", 9000, 1, 4, 300, 100, "Sf", "yellow" );
// r4 = makeModel( "prey", 9000, 1, 4, 400, 000, "Sf", "green" );
// r5 = makeModel( "prey", 9000, 1, 4, 0, 400, "Sf", "purple" );
// r6 = makeModel( "prey", 9000, 1, 4, 0, 0, "Sf", "pink" );
// r7 = makeModel( "prey", 9000, 1, 4, 400, 400, "Sf", "orange" );
// populate(1000, templatePrey)

window.requestAnimationFrame();

// drawModel(r1, ctx)

};