var topBoundary = 0;
var bottomBoundary;
var cells = [];
var canvas, ctx, $genButton, $clearButton, size, particleCount, lifespan, speed, clustered, clearCells, opacity, $input, $toggle, cellType, breeding, colorInheritance;
var nextGeneration;

var genCanvas = function(){
  var $canvas = document.createElement('canvas');
  $canvas.width = window.innerWidth;
  $canvas.height = window.innerHeight;
  bottomBoundary = $canvas.height;
  document.body.appendChild( $canvas );
}


var makeModel = function(type, lifespan, speed, size, x, y, genes, color) {
  var model = {
    type: type,
    speed: speed,
    size: size,
    lifespan: lifespan,
    lifeRemaining: lifespan,
    timesSinceLastFed: Date.now(),
    timesSinceLastBred: Date.now(),
    createdAt: Math.floor(Date.now() / 1000),
    X: x,
    Y: y,
    genes: genes,
    color: color,
    hue: 0
  };
  return model
};

var clearPreviousIndex = function(model, context) {
  context.clearRect(model.X, model.Y, model.size, model.size);
};

var drawModel = function(model, context) {
  ctx.fillStyle = model.color;
  // ctx.fillStyle = 'hsla(' + model.hue + ", 100%, 50%, " + opacity + ")";
  context.fillRect(model.X, model.Y, model.size, model.size);
};


var getRange = function(num, range, model) {
  // debugger
  // var returnVal;

  // // If a model has been passed to the range generator
  // if( model ){
  //   // If canvas bounds are exceeded -- reroll
  //     var largestVal = canvas.width > canvas.height ? canvas.width : canvas.height;
  //     returnVal = Math.abs( Math.round(Math.random() * ((num + largestVal) - (num - largestVal))) + (num - largestVal) );
  //   while (
  //     model.X < 0 && model.X > canvas.width ||
  //     model.Y < 0 && model.Y > canvas.height
  //   ) {
  //     var next = getRange(num, largestVal);
  //     if ( next ) {
  //       return next;
  //     }
  //   }
  //   // return 
  // } else {
  //   // debugger
    return Math.abs( Math.round(Math.random() * ((num + range) - (num - range))) + (num - range) );
  // }
  // return returnVal;
};


var populate = function(num, template) {
  for (var i = 0; i < num; i++) {
    opacity = opacity || 0.1;
    template.X = template.X || getRange(0, canvas.width, template);
    template.Y = template.Y || getRange(0, canvas.height, template);
    // console.log( template.X, " and ", template.Y )
    template.color = template.color || getRandomColor(opacity);
    template.type = template.type || "prey";
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
      template.X = getRange(0, bottomBoundary, true);
      template.Y = getRange(0, bottomBoundary, true);
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
    var maxX = getRange( 1, canvas.width );
    var maxY = getRange( 1, canvas.height )

    var child = makeModel(model1.type, model1.lifespan, model1.speed, model1.size, maxX, maxY, model1.genes);
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
  nextGeneration = [];
  if (cells.length > 0) {
    for (var i = 0; i < cells.length; i++) {
      model = cells[i];
      if (cells.length > 0) {
    if (Math.floor(Date.now() / 1000) - model.createdAt < model.lifeRemaining && nextGeneration.indexOf( model ) < 0 ) {
      nextGeneration.push(model);
    if( breeding ){
      var sinceLastSpawn = (Date.now() - model.timesSinceLastBred) / 10;
        if (sinceLastSpawn > model.lifeRemaining * 100 / 10) {

          var genLength = cells.length;

          for (var j = i + 1; j < genLength; j++) {
            if( j >= genLength || cells[j] === undefined ){
              j = i;
            }
            // console.log( j )
            if (intersects(model, cells[j]) &&

              (Date.now() - cells[j].timesSinceLastBred / 10) > cells[j].lifeRemaining * 100 / 10) {
                            // console.log("contact")

              if( model.type === cells[j].type ){
                nextGeneration.push( breed( model, nextGeneration[j]) );
                model.timesSinceLastBred = Date.now() + model.lifeRemaining * 1000 / 10;
                cells[j].timesSinceLastBred = Date.now() + cells[j] * 1000 / 10;
              } else {
                // debugger
                if(model.type === "predator"){
                  model.createdAt = Math.floor(Date.now() / 1000);
                  cells[j].lifeRemaining = 0;
                } else {
                  model.lifeRemaining = 0;
                  cells[j].createdAt = Math.floor(Date.now() / 1000);
                }
              };

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

        // model.hue ++;
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
  return !(cellTwo.X > cellOne.X + cellOne.size ||
           cellTwo.X + cellOne.size < cellOne.X ||
           cellTwo.Y > cellOne.Y + cellOne.size ||
           cellTwo.Y + cellOne.size < cellOne.Y);
}


  // intersection: function( head, item ) {
  //   return !(item.x > head.x + app.snake.body.size - 1 ||
  //            item.x + app.snake.body.size - 1 < head.x ||
  //            item.y > head.y + app.snake.body.size - 1 ||
  //            item.y + app.snake.body.size - 1 < head.y);
  // },

var getDomValues = function() {

  canvas = document.querySelector('canvas');
  ctx = canvas.getContext("2d");
  $genButton = document.querySelector('.generate');
  $clearButton = document.querySelector('.clear');
  $input = document.querySelector('input');
  $toggle = document.querySelector('.toggle');

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
  genCanvas();
  getDomValues();

    // template1 = { type: "prey", lifespan: 20, speed: speed, size: 2, genes: "Sf", color: "rgba( 200, 0, 30, 0.4 )" };
    // template2 = { type: "predator", lifespan: 20, speed: speed, size: 3, genes: "Sf", color: "rgba( 0, 255, 0, 0.4 )" };
    // populate(70, template2);
    // populate(1000, template1);


  templatePrey = { type: "prey", lifespan: 7, speed: 1, size: 2, X: 200, Y: 200, genes: "Sf", color: "rgba(255, 255, 255, 0.1)" };
  populate(5000, templatePrey);
  templatePrey.color = "rgba(50, 50, 50, 0.1)";
  templatePrey.speed = 5;
  populate(2000, templatePrey);

  $genButton.onclick = function() {
    getDomValues();
    // debugger
    template = { type: cellType, lifespan: lifespan, speed: speed, size: size, genes: "Sf" };
    populate(particleCount, template);
  };

  $input.onclick = function() {
    getDomValues();
    lifeCycle();
  };


  $toggle.onclick = function(){
    document.querySelector('.controls').classList.toggle('hidden');
    this.classList.toggle('arrowUp');
    this.classList.toggle('arrowDown');
    
  };

  $clearButton.onclick = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  window.requestAnimationFrame(function() {
    lifeCycle();
  });
};

