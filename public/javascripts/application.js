function RoundRobin(processes,quantum) {
  var graph = [];
  for (var i=0; i < processes.length; i++) {
    graph[i] = [];
  }

  var cicle = 0;
  var queue = new Queue();
  var dif=0;
  var bandera =false;

  while (cantidadEliminados(processes) != processes.length) {
    queue = RRNextProcess(cicle, processes, queue,bandera);

    if (queue.isEmpty()==false) {
      var index= queue.peek(); //saca el indice del frente
      var dif= (processes[index].cicles - processes[index].countcicles);//aca hay un problema

      if( dif > quantum){    //si los ciclos q le faltan - los q hizo son mayores q el quantum
        var process=processes[index];
        subtractRR(process, processes,quantum); // elimino los ciclos

        for(var i=cicle ;i< (cicle + quantum);i++){
          graph[index][i] = 'r';	}
          for (var j=process.creationCicle; j<cicle;j++){
            if(graph[process.index][j] != 'r')
              graph[process.index][j]='w';
          }

          cicle+=quantum;
          bandera=true;
       }
       else{
         var process=processes[index];
         processes[index].countcicles = processes[index].cicles;
         queue.erase(index);
         for(var i=cicle ;i< (cicle + dif);i++){
           graph[index][i] = 'r';}
         for (var j=process.creationCicle; j<cicle;j++){
           if(graph[process.index][j] != 'r')
             graph[process.index][j]='w';
         }
         cicle+=dif;
         bandera=false;
       }
    }
    else{
     cicle++;
    }
  }

  return graph;
}


function RRNextProcess(cicle, processes, queue,bandera) {

  if(queue.tamanio != 0)
    var pos=queue.tamanio();

  for (var i=0; i < processes.length; i++) {
    if ((cicle >= processes[i].creationCicle)&& (processes[i].cicles != processes[i].countcicles)) {

      if (queue.pertenece(processes[i].index)==false) {
        queue.enqueue(processes[i].index);
      }
    }
  }

//acomodar la ultima parte de la cola (esta parte falta)
/*
if(pos < queue.tamanio()){
  for(var j=pos;j<queue.tamanio();j++){
    menor=buscamenor(queue,processes,j);
    queue.mover(menor,j);
    alert("entra");
  }}
*/

  if((bandera == true) && (queue.tamanio()>1)){
    var ind=queue.peek();
    queue.erase(ind);
    queue.enqueue(ind);
  }

  return queue;
}

/*
function buscamenor(queue,processes,posdesde){
  var posMenor=posdesde;
  var menor=processes[queue.mostrarpos(posdesde)].creationCicle;	
  for(var k=posdesde+1;k<queue.tamanio();k++){
    if(processes[queue.mostrarpos(k)].creationCicle < menor)
    menor=queue.mostrarpos(k);
    posMenor=k;
  }
  alert(menor);
  return menor;
}
*/


function subtractRR(process, processes,cant) {
  for (var i=0; i < processes.length; i++) {
    if (processes[i] == process) {
      processes[i].countcicles+=cant;
    }
  }
}

function cantidadEliminados(processes){
  var cantidad = 0;
  for(var k=0 ;k < processes.length; k++){
    if(processes[k].cicles == processes[k].countcicles)
      cantidad++;
  }
  return cantidad;
}

//-------------------------Funcion Prioridad

function prioridad(processes) {
  var graph = [];
  for (var i=0; i < processes.length; i++) {
    graph[i] = [];
  }

  var cicle = 0;
  // TODO en el futuro cambiar por haveBeenAllProcessesRan(processes)
  while (processes.length != 0) {
    var process = prioridadNextProcess(cicle, processes);
    if (typeof process == 'object') {
      graph[process.index][cicle] = 'r';

      for (var k=process.creationCicle; k<cicle;k++){
        if(graph[process.index][k] != 'r')
          graph[process.index][k]='w';
      }
    subtractone(process, processes);
    }
    cicle++;
  }
  return graph;
}

function prioridadNextProcess(cicle, processes) {
  var firstProcess = false;
  for (var i=0; i < processes.length; i++) {
    // TODO if (process[i].hasBeenRan()) continue;
    if (cicle >= processes[i].creationCicle) {
      if (firstProcess === false || processes[i].priority >firstProcess.priority  ) {
        firstProcess = processes[i];
      }
    }
  }
  return firstProcess;
}

function subtractone(process, processes) {
  for (var i=0; i < processes.length; i++) {
    if (processes[i] == process) {
      if (process.cicles == (process.countcicles + 1) ){
        removeProcess(process,processes)
        return true;
      }
      else{
        processes[i].countcicles++;
        return true;
      }
    }
  }
  return false;
}

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

function acceptNum(event){
  var key = window.Event ? event.which : event.keyCode
  return ((key >= 48 && key <= 57) || ( key == 8)|| ( key == 75)  )
}

function valida(condicion) {

  var quantum = document.getElementById('quantum').value*1;

  var c0 = document.getElementById('llegada-01').value ;
  var c1 = document.getElementById('llegada-02').value ;
  var c2 = document.getElementById('llegada-03').value ;
  var c3 = document.getElementById('llegada-04').value ;
  var c4 = document.getElementById('llegada-05').value ;
  var c5 = document.getElementById('llegada-06').value ;
  var c6 = document.getElementById('llegada-07').value ;
  var c7 = document.getElementById('llegada-08').value ;
  var c8 = document.getElementById('llegada-09').value ;
  var c9 = document.getElementById('llegada-10').value ;

  var cy0 = document.getElementById('rafagas-01').value;
  var cy1 = document.getElementById('rafagas-02').value;
  var cy2 = document.getElementById('rafagas-03').value;
  var cy3 = document.getElementById('rafagas-04').value;
  var cy4 = document.getElementById('rafagas-05').value;
  var cy5 = document.getElementById('rafagas-06').value;
  var cy6 = document.getElementById('rafagas-07').value;
  var cy7 = document.getElementById('rafagas-08').value;
  var cy8 = document.getElementById('rafagas-09').value;
  var cy9 = document.getElementById('rafagas-10').value;

  var p0 = document.getElementById('prioridad-01').value;
  var p1 = document.getElementById('prioridad-02').value;
  var p2 = document.getElementById('prioridad-03').value;
  var p3 = document.getElementById('prioridad-04').value;
  var p4 = document.getElementById('prioridad-05').value;
  var p5 = document.getElementById('prioridad-06').value;
  var p6 = document.getElementById('prioridad-07').value;
  var p7 = document.getElementById('prioridad-08').value;
  var p8 = document.getElementById('prioridad-09').value;
  var p9 = document.getElementById('prioridad-10').value;

// TODO validar si estan en blanco

  var processe = [
    { index: 0, creationCicle: c0, cicles: cy0, priority: p0, countcicles: 0 },
    { index: 1, creationCicle: c1, cicles: cy1, priority: p1, countcicles: 0 },
    { index: 2, creationCicle: c2, cicles: cy2, priority: p2, countcicles: 0 },
    { index: 3, creationCicle: c3, cicles: cy3, priority: p3, countcicles: 0 },
    { index: 4, creationCicle: c4, cicles: cy4, priority: p4, countcicles: 0 },
    { index: 5, creationCicle: c5, cicles: cy5, priority: p5, countcicles: 0 },
    { index: 6, creationCicle: c6, cicles: cy6, priority: p6, countcicles: 0 },
    { index: 7, creationCicle: c7, cicles: cy7, priority: p7, countcicles: 0 },
    { index: 8, creationCicle: c8, cicles: cy8, priority: p8, countcicles: 0 },
    { index: 9, creationCicle: c9, cicles: cy9, priority: p9, countcicles: 0 }
  ];

  var z = 0;
  var processes = [];

  for (var i=0; i < 10; i++) {
    if ( (processe[i].creationCicle == '') || (processe[i].cicles == '') || (processe[i].priority == '')){
      // something
    }
    else{
      processes.push({
         index       : z, creationCicle : processe[i].creationCicle * 1,
         cicles      : processe[i].cicles *1,
         priority    : processe[i].priority *1,
         countcicles : 0
       });

       z++;
     }
  }

  switch (condicion) {
    case 'sjn':
      grafico = new GraphData(sjn(processes));
      drawGraph(grafico);
      drawTable(grafico);
      break

    case 'fifo':
      grafico = new GraphData(fifo(processes));
      drawGraph(grafico);
      drawTable(grafico);
      break

    case 'prioridad':
      grafico = new GraphData(prioridad(processes));
      drawGraph(grafico);
      drawTable(grafico);
      break

    case 'RR':
      alert(condicion);
      grafico = new GraphData(RoundRobin(processes,quantum));
      drawGraph(grafico);
      drawTable(grafico);
      break
  }
}
