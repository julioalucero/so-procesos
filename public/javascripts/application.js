function sjn(processes) {
  var graph = [];
  for (var i=0; i < processes.length; i++) {
    graph[i] = [];
}

  var cicle = 0;
  // TODO en el futuro cambiar por haveBeenAllProcessesRan(processes)
  while (processes.length != 0) {
    var process = sjnNextProcess(cicle, processes);
    if (typeof process == 'object') {
      for (var i=0; i < process.creationCicle; i++) {
        graph[process.index][i] = 'n';
      }
      for (var i=process.creationCicle; i < cicle; i++) {
        graph[process.index][i] = 'w';
      }
      for (var i=0; i < process.cicles; i++) {
        graph[process.index][cicle + i] = 'r';
      }
      // TODO no necesita borrarse cuando usas haveBeenAllProcessesRan
      removeProcess(process, processes);
      cicle += process.cicles;
    } else {
      cicle++;
    }
  }
  return graph;
}

function sjnNextProcess(cicle, processes) {
  var firstProcess = false;
  for (var i=0; i < processes.length; i++) {
    // TODO if (process[i].hasBeenRan()) continue; 
    if (cicle >= processes[i].creationCicle) {
     if (firstProcess === false || firstProcess.cicles > processes[i].cicles) {      
        firstProcess = processes[i];
      }
    }
  }
  return firstProcess;
}


function fifo(processes) {
  var graph = [];
  for (var i=0; i < processes.length; i++) {
    graph[i] = [];
  }

  var cicle = 0;
  // TODO en el futuro cambiar por haveBeenAllProcessesRan(processes)
  while (processes.length != 0) {
    var process = fifoNextProcess(cicle, processes);
    if (typeof process == 'object') {
      for (var i=0; i < process.creationCicle; i++) {
        graph[process.index][i] = 'n';
      }
      for (var i=process.creationCicle; i < cicle; i++) {
        graph[process.index][i] = 'w';
      }
      for (var i=0; i < process.cicles; i++) {
        graph[process.index][cicle + i] = 'r';
      }
      // TODO no necesita borrarse cuando usas haveBeenAllProcessesRan
      removeProcess(process, processes);
      cicle += process.cicles;
    } else {
      cicle++;
    }
  }
  return graph;
}

function fifoNextProcess(cicle, processes) {
  var firstProcess = false;
  for (var i=0; i < processes.length; i++) {
    // TODO if (process[i].hasBeenRan()) continue; 
    if (cicle >= processes[i].creationCicle) {
      if (firstProcess === false || firstProcess.creationCicle > processes[i].creationCicle) {
        firstProcess = processes[i];
      }
    }
  }
  return firstProcess;
}

function removeProcess(process, processes) {
  for (var i=0; i < processes.length; i++) {
    if (processes[i] == process) {
      processes.splice(i, 1);
      return true;
    }
  }
  return false;
}

// TODO usar en el futuro
function haveBeenAllProcessesRan() {
  for (var i=0; i < processes.length; i++) {
    if (!processes[i].hasBeenRan()) return false;
  }
  return true;
}


function drawGraph(graphData) {
  // Borrar tabla anterior
  var container = $('#graph-container').empty();
  // Crear nueva tabla
  var table = $('<table></table>').appendTo(container);
  for (var i=0; i < graphData.processesCount; i++) {
    var row = $('<tr></tr>').appendTo(table);
    for (var j=0; j < graphData.ciclesCount; j++) {
      $('<td></td>').appendTo(row);
    }
  }
  // Pintar nueva tabla
  table.find('tr').each(function(processNumber, tr) {
    $(tr).find('td').each(function(cicleNumber, td) {
      if (graphData.isRunning(cicleNumber, processNumber)) {
        $(td).addClass('running');
      } else if (graphData.isWaiting(cicleNumber, processNumber)) {
        $(td).addClass('waiting');
      } else {
        $(td).addClass('doesnt-exist');
      }
    });
  });

  return table;
}

var GraphData = function(dataArray) {
  this.processesCount = dataArray.length;
  this.ciclesCount = dataArray[0].length;
  for (var i=1; i < dataArray.length; i++) {
    if (this.ciclesCount < dataArray[i].length) {
      this.ciclesCount = dataArray[i].length;
    }
  }
  this.dataArray = dataArray;
};

GraphData.prototype.isRunning = function(cicle, process) {
  return this.dataArray[process][cicle] == 'r';
};

GraphData.prototype.isWaiting = function(cicle, process) {
  return this.dataArray[process][cicle] == 'w';
};

function drawTable(graphData) {
  // Borrar tabla anterior
  var container = $('#table-container').empty();
  // Crear nueva tabla
  var table = $('<table></table>').appendTo(container);
  for (var i=0; i < 4 + 1; i++) {
    var row = $('<tr></tr>').appendTo(table);
    for (var j=0; j < 7; j++) {
      if (i==0){
        switch(j){
          case 0:
            $('<th>Numero de proceso</th>').appendTo(row); break;
          case 1:
            $('<th>Instante de Llegado</th>').appendTo(row); break;
          case 2:
            $('<th>Tiempo de Ejecución</th>').appendTo(row); break;
          case 3:
            $('<th>Instante de Finalización</th>').appendTo(row); break;
          case 4:
            $('<th>T</th>').appendTo(row); break;
          case 5:
            $('<th>E</th>').appendTo(row); break;
          case 6:
            $('<th>I</th>').appendTo(row); break;
        }
      }
      else
      {
        switch(j){
          case 0:
            $('<td>'+ i +'</td>').appendTo(row); break;

          case 1:
            var tiempoDeLlegada = -1;
            for (var w=0; w < graphData.dataArray[i-1].length; w++){
              tiempoDeLlegada++;
              if (graphData.dataArray[i-1][w] == 'w' || graphData.dataArray[i-1][w] == 'r'){
                $('<td>'+ tiempoDeLlegada +'</td>').appendTo(row); break;
              };
            }; break;

          case 2:
            var tiempoDeEjecucion = 0;
            for (var w=0; w < graphData.dataArray[i-1].length; w++){
                if (graphData.dataArray[i-1][w] == 'r'){
                  tiempoDeEjecucion++;
                }
             }
             $('<td>'+ tiempoDeEjecucion +'</td>').appendTo(row); break;

          case 3:
             var tiempoDeFinalizacion = graphData.dataArray[i-1].length;
             $('<td>'+ tiempoDeFinalizacion +'</td>').appendTo(row); break;

          case 4:
            var T = tiempoDeFinalizacion - tiempoDeLlegada;
            $('<td>' + T + '</td>').appendTo(row); break;

          case 5:
            var E = T - tiempoDeEjecucion;
            $('<td>'+ E +'</td>').appendTo(row); break;

          case 6:
            var I = tiempoDeEjecucion / T 
            $('<td>' + I  + '</td>').appendTo(row); break;
        }
      }
    }
  }

  console.log(graphData)
}

$("#random-button").live('click', function(e) { e.preventDefault(); aleatorio(); });

function aleatorio(){
  document.getElementById('llegada-01').value =Math.floor(Math.random()*10);
  document.getElementById('llegada-02').value =Math.floor(Math.random()*10);
  document.getElementById('llegada-03').value =Math.floor(Math.random()*10);
  document.getElementById('llegada-04').value =Math.floor(Math.random()*10);
  document.getElementById('llegada-05').value =Math.floor(Math.random()*10);
  document.getElementById('llegada-06').value =Math.floor(Math.random()*10);
  document.getElementById('llegada-07').value =Math.floor(Math.random()*10);
  document.getElementById('llegada-08').value =Math.floor(Math.random()*10);
  document.getElementById('llegada-09').value =Math.floor(Math.random()*10);
  document.getElementById('llegada-10').value =Math.floor(Math.random()*10);

  document.getElementById('rafagas-01').value =Math.floor(Math.random()*5 + 1);
  document.getElementById('rafagas-02').value =Math.floor(Math.random()*5 + 1);
  document.getElementById('rafagas-03').value =Math.floor(Math.random()*5 + 1);
  document.getElementById('rafagas-04').value =Math.floor(Math.random()*5 + 1);
  document.getElementById('rafagas-05').value =Math.floor(Math.random()*5 + 1);
  document.getElementById('rafagas-06').value =Math.floor(Math.random()*5 + 1);
  document.getElementById('rafagas-07').value =Math.floor(Math.random()*5 + 1);
  document.getElementById('rafagas-08').value =Math.floor(Math.random()*5 + 1);
  document.getElementById('rafagas-09').value =Math.floor(Math.random()*5 + 1);
  document.getElementById('rafagas-10').value =Math.floor(Math.random()*5 + 1);

  document.getElementById('prioridad-01').value= Math.floor(Math.random()*8);
  document.getElementById('prioridad-02').value= Math.floor(Math.random()*8);
  document.getElementById('prioridad-03').value= Math.floor(Math.random()*8);
  document.getElementById('prioridad-04').value= Math.floor(Math.random()*8);
  document.getElementById('prioridad-05').value= Math.floor(Math.random()*8);
  document.getElementById('prioridad-06').value= Math.floor(Math.random()*8);
  document.getElementById('prioridad-07').value= Math.floor(Math.random()*8);
  document.getElementById('prioridad-08').value= Math.floor(Math.random()*8);
  document.getElementById('prioridad-09').value= Math.floor(Math.random()*8);
  document.getElementById('prioridad-10').value= Math.floor(Math.random()*8);
}

$(document).ready(function() {
  $
  // TODO Esta info debería salir de un formulario, asegurate de respetar los index.
/*
  var processes = [
    { index: 0, creationCicle: 1, cicles: 2 },
    { index: 1, creationCicle: 0, cicles: 2 },
    { index: 2, creationCicle: 4, cicles: 3 },
    { index: 3, creationCicle: 1, cicles: 1 },
  ];

  var processes_table = [
    { index: 0, creationCicle: 1, cicles: 2 },
    { index: 1, creationCicle: 0, cicles: 2 },
    { index: 2, creationCicle: 4, cicles: 3 },
    { index: 3, creationCicle: 1, cicles: 1 },
  ];

  drawGraph(new GraphData(fifo(processes)));

  drawTable(new GraphData(fifo(processes_table)));
*/
});
