var topBoundary = 0;
var bottomBoundary = 400;
var cells = [];
var canvas, ctx, $genButton, $clearButton, size, particleCount, lifespan, speed, clustered, clearCells, opacity, $input, cellType, breeding, colorInheritance;
var nextGeneration;

var makeModel = function(type, lifespan, speed, size, x, y, genes, color) {
  var model = {
    type: type,
    speed: speed,
    size: size,
    lifespan: lifespan,
    timesSinceLastBred: Date.now(),
    createdAt: Math.floor(Date.now() / 1000),
    X: x,
    Y: y,
    genes: genes,
    color: color
  };
  return model
};


var clearPreviousIndex = function(model, context) {
  context.clearRect(model.X, model.Y, model.size, model.size);
};

var drawModel = function(model, context) {
  ctx.fillStyle = model.color
  context.fillRect(model.X, model.Y, model.size, model.size);
};


var getRange = function(num, range) {
  var returnVal = Math.round(Math.random() * ((num + range) - (num - range))) + (num - range);
  // If canvas bounds are exceeded -- reroll
  while (returnVal > bottomBoundary || returnVal < topBoundary) {
    var next = getRange(num, range);
    if (next) {
      return next;
    }
  }
  return returnVal;
};


var populate = function(num, template) {
  for (var i = 0; i < num; i++) {
    opacity = opacity || 0.1;
    template.X = template.X || getRange(0, bottomBoundary);
    template.Y = template.Y || getRange(0, bottomBoundary);
    // template.lifespan = 1000
    // console.log(template.lifespan)
    template.color = template.color || getRandomColor(opacity);
    c = makeModel(
      template.type,
      template.lifespan,
      template.speed,
      template.size,
      template.X,
      template.Y,
      template.genes,
      template.color
    );
    cells.push(c);
    if (!clustered) {
      template.X = getRange(0, bottomBoundary);
      template.Y = getRange(0, bottomBoundary);
    }
    if (rainbow) {
      template.color = getRandomColor(opacity);
    }
  }
};

function getRandomColor(opacity) {
  var color = 'rgba( ';
  for (var i = 0; i < 3; i++) {
    color += getRange(0, 255) + ', ';
  }
  color += (opacity + ' )');
  return color;
}


var breed = function(model1, model2) {

              // console.log("contact")
    // type: "prey", lifespan: 4, speed: 1, size: 2, X: 200, Y: 200, genes: "Sf", color: "rgba(255, 255, 255, 0.1)"

    var child = makeModel(model1.type, model1.lifespan, model1.speed, model1.size, getRange(1, bottomBoundary), getRange(1, bottomBoundary), model1.genes);
    // debugger

    if( colorInheritance ){ 
      // debugger
      child.color = model1.color
    } else {
      child.color = getRandomColor(opacity)
    }

    return child;
}

var lifeCycle = function() {
  // d = Date.now()

  //TODO - Split breed to a new function
  // Age sort to front - If the model is dead, just nuke & ignore it
  // Prey/predator => set prey life to 0 and predator lifespan to now
  // Ideally kill prey and never iterate it.
  // Split breed to type intersections => if types are ===

    // if( cells.length <= 0 ){
    //  return
    // }
    nextGeneration = [];

  // if( cells.length === 0 ){
  //   console.log( "No cells found." )
  // }

  if (cells.length > 0) {
    // debugger
      for (var i = 0; i < cells.length; i++) {
        // If the 'clear' checkbox is checked - kill the trail as the particle moves.
        model = cells[i]



    if (cells.length > 0) {
    if (Math.floor(Date.now() / 1000) - model.createdAt < model.lifespan && nextGeneration.indexOf( model ) < 0 ) {
      nextGeneration.push(model);
    if( breeding ){  
      var sinceLastSpawn = (Date.now() - model.timesSinceLastBred) / 10;
        if (sinceLastSpawn > model.lifespan * 100 / 10) {

          var genLength = cells.length;

          for (var j = i + 1; j < genLength; j++) {
            if( j >= genLength || cells[j] === undefined ){
              j = i;
            }
            // console.log( j )
            if (intersects(model, cells[j]) &&

              (Date.now() - cells[j].timesSinceLastBred / 10) > cells[j].lifespan * 100 / 10) {
                            // console.log("contact")

              if( model.type === cells[j].type ){
                nextGeneration.push( breed( model, nextGeneration[j]) );
                model.timesSinceLastBred = Date.now() + model.lifespan * 1000 / 10;
                cells[j].timesSinceLastBred = Date.now() + cells[j] * 1000 / 10;
              } else {
                // debugger
                model.type === "predator" ? model.lifespan = Math.floor(Date.now() / 1000) : cells[j].lifespan = 0;
                var prey = model.type === "prey" ? cells[j].lifespan = 0 : model.lifespan = Math.floor(Date.now() / 1000);
              }

            }

          }
        }
  }



            //Step
        if (clearCells) {
          clearPreviousIndex(model, ctx)
        }
        model.X = getRange(model.X, (model.size * model.speed));
        model.Y = getRange(model.Y, (model.size * model.speed));

        drawModel(model, ctx);

    } else {

        if (clearCells) {
          clearPreviousIndex(model, ctx)
        }
        // debugger

        // debugger
        // console.log( sinceLastSpawn )
        // console.log( model.lifespan * 1000 / 10 )

          // debugger
              // debugger

        
      };
    } 
    // console.log( cells )
    // console.log( nextGeneration )
      // if (nextGeneration.length === 0 && i === cells.length) {
      //   // debugger
      //   break
      // }
      // cells.shift();
    }
  }
  cells = nextGeneration;
  window.requestAnimationFrame(lifeCycle);
    // console.log( cells.length );

  // console.log( Date.now() - d );
  // debugger
}



var intersects = function(cellOne, cellTwo) {
  return !(cellOne.X > (cellTwo.X + cellTwo.size) ||
    (cellOne.X + cellOne.size) < cellTwo.X ||
    cellOne.Y > (cellTwo.Y + cellTwo.Size) ||
    (cellOne.Y + cellOne.Size) < cellTwo.Y);
}

var getDomValues = function() {

  canvas = document.querySelector('canvas');
  ctx = canvas.getContext("2d");
  $genButton = document.querySelector('.generate');
  $clearButton = document.querySelector('.clear');
  $input = document.querySelector('input');

  clearCells = !document.querySelector('.trail').checked;
  clustered = document.querySelector('.clustered').checked;
  size = parseInt(document.querySelector('.size').value);
  particleCount = parseInt(document.querySelector('.particles').value);
  lifespan = parseInt(document.querySelector('.lifespan').value);
  opacity = parseFloat(document.querySelector('.opacity').value);
  speed = parseInt(document.querySelector('.speed').value);
  rainbow = document.querySelector('.rainbow').checked;
  cellType = document.querySelector('.cellType').checked;
  breeding = document.querySelector('.breeding').checked;
  colorInheritance = document.querySelector('.inheritCol').checked;

}

window.onload = function() {
  getDomValues();

    // template1 = { type: "prey", lifespan: 20, speed: speed, size: size, genes: "Sf", color: "rgba(255,0,0,0.5)" };
    // template2 = { type: "predator", lifespan: 5, speed: speed, size: size, genes: "Sf", color: "rgba(0,0,255, 0.5)" };
    // populate(5, template1);
    // populate(20, template2);


  // templatePrey = { type: "prey", lifespan: 4, speed: 1, size: 2, X: 200, Y: 200, genes: "Sf", color: "rgba(255, 255, 255, 0.1)" };
  // populate(5000, templatePrey);
  // templatePrey.color = "rgba(50, 50, 50, 0.1)";
  // templatePrey.speed = 5;
  // populate(2000, templatePrey);

  $genButton.onclick = function() {
    getDomValues();
    // debugger
    template = { type: cellType, lifespan: lifespan, speed: speed, size: size, genes: "Sf" };
    populate(particleCount, template);
  }

  $input.onclick = function() {
    getDomValues();
    lifeCycle();
  }

  $clearButton.onclick = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.requestAnimationFrame(function() {
    lifeCycle();
  });
};
