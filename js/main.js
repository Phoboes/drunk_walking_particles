var topBoundary = 0;
var bottomBoundary = 400;
var cells = new Set();
var canvas, ctx, $genButton, $clearButton, size, particleCount, lifespan, speed, clustered, clearCells, opacity;

var makeModel = function( type, lifespan, speed, size, x, y, genes, color ){
	var model = {
		type: type,
		speed: speed,
		size: size,
		lifespan: lifespan,
		created_at: Math.floor(Date.now() / 1000),
		X: x,
		Y: y,
		genes: genes,
		color: color
	};
	return model
};


var clearPreviousIndex = function( model, context ){
	context.clearRect(model.X, model.Y, model.size, model.size);
};

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


var populate = function(num, template){
	for( var i = 0; i < num; i++ ){
		opacity = opacity || 0.1;
		template.X = template.X || getRange( 0, bottomBoundary );
		template.Y = template.Y || getRange( 0, bottomBoundary );
		// template.lifespan = 1000
		console.log(template.lifespan)
		template.color = template.color || getRandomColor( opacity );
		c = makeModel(  
				template.type, 
				template.lifespan,
				template.speed,
				template.size,
				template.X,
				template.Y,
				template.genbes,
				template.color
			);
		cells.add( c );
		if( !clustered ){
		template.X = getRange( 0, bottomBoundary );
		template.Y = getRange( 0, bottomBoundary );
		}
		if( rainbow ){
			template.color = getRandomColor( opacity );
		}
	}
};

function getRandomColor( opacity ) {
    var color = 'rgba( ';
    for (var i = 0; i < 3; i++ ) {
        color += getRange( 0, 255 ) + ', ';
    }
    color += ( opacity + ' )');
    return color;
}

var lifeCycle = function(){
	// d = Date.now()
	cells.forEach( function( model ){
		// If the 'clear' checkbox is checked - kill the trail as the particle moves.
		if( clearCells ){
			clearPreviousIndex( model, ctx )
		}

		//Step
		model.X = getRange(model.X, ( model.size * model.speed ));
		model.Y = getRange(model.Y, ( model.size * model.speed ));


		Math.floor( Date.now() / 1000 ) - model.created_at < model.lifespan ? drawModel( model, ctx ) : cells.delete( model );
	});
	window.requestAnimationFrame( lifeCycle );

	// console.log( Date.now() - d );
	// debugger
}

var intersects = function(cellOne, cellTwo) {
    return !( cellOne.X           > ( cellTwo.X +  cellTwo.size) || 
             (cellOne.X + cellOne.size) <   cellTwo.X           || 
              cellOne.Y           > ( cellTwo.Y +  cellTwo.Size) ||
             (cellOne.Y + cellOne.Size) <   cellTwo.Y);
}

var getDomValues = function(){

	canvas = document.querySelector('canvas');
	ctx = canvas.getContext("2d");
	$genButton = document.querySelector('.generate');
	$clearButton = document.querySelector('.clear')

	clearCells = !document.querySelector('.trail').checked;
	clustered = document.querySelector('.clustered').checked;
	size = parseInt( document.querySelector('.size').value );
	particleCount = parseInt( document.querySelector('.particles').value );
	lifespan = parseInt( document.querySelector('.lifespan').value );
	opacity = parseFloat( document.querySelector('.opacity').value );
	speed = parseInt( document.querySelector('.speed').value );
	rainbow = document.querySelector('.rainbow').checked;
}

window.onload = function(){
	getDomValues();

	templatePrey = { type: "prey", lifespan: 4, speed: 1, size: 2, X: 200, Y: 200, genes: "Sf", color: "rgba(255, 255, 255, 0.1)" };
	populate(5000, templatePrey);
	templatePrey.color = "rgba(50, 50, 50, 0.1)";
	templatePrey.speed = 5;
	populate(2000, templatePrey);

	$genButton.onclick = function(){
		getDomValues();
		template = { type: "prey", lifespan: lifespan, speed: speed, size: size, genes: "Sf" };
		populate(particleCount, template);
	}

	$clearButton.onclick = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	window.requestAnimationFrame(function(){
		lifeCycle();
	});
};
