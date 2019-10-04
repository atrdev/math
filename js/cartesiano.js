
const Cartesiano = (function (canvas_element, { escala = 25,
  margin_spaces = 30,
  alfabeto = [["a"], ["b"], ["a+b"], ["a-b"], ["a*b"], ["-a"]],
  plan_graph = [0, 0],
  showLabels = true,
  pontoOrigem = true,
  labelType = "number",
  graphCartesian = "defaultGraph"
}) {
  // Canvas element
  let canvas = (typeof canvas_element == "string") ? document.getElementById(canvas_element) : canvas_element;

  let context = canvas.getContext('2d');


  // Sequencia de letras que será nomeadao os pontos
  let alfabeto_for_lines = ["|AB|"];

  // cálcula a escala para ter um espaçamento em seu limite
  escala = Math.ceil(escala * 1.2);

  // cálcula o tamanho em pixels de cada unidade para cada coordenada da escala determinada.
  let step_size = [Math.floor(((margin_spaces * 2) + canvas.width) / escala), Math.floor(((margin_spaces * 2) + canvas.height) / escala)];

  // ponto em pixels do ponto zero do 1º Quadrante
  let ponto_zero = [((0.5 * canvas.width) + (canvas.width * (plan_graph[0]) * 0.5)), ((0.5 * canvas.height) + (canvas.height * (plan_graph[1]) * 0.5))];

  // Converte a coordenada do 1º Quadrante para 4º Quadrante (Pixels) 
  const converte_primeiro_para_quarto = (coordenada) => [ponto_zero[0] + (coordenada[0] * step_size[0]), ponto_zero[1] + (coordenada[1] * step_size[1] * -1)];

  let pontos_criados = [];

  /*
    Função que desenha todos os componentes de um ponto no plano cartesiano
  */
  this.drawnPoint = function (coordenada, index) {
    // Converte a coordenada do 1º Quadrante para 4º Quadrante (Pixels) 
    let coordenada_normalizada = converte_primeiro_para_quarto(coordenada);

    context.beginPath();
    context.moveTo(coordenada_normalizada[0], coordenada_normalizada[1]);
    // cria o ponto
    context.arc(coordenada_normalizada[0], coordenada_normalizada[1], 3, 0, Math.PI * 2, true);
    context.fill();

    // cria o texto
    context.font = 'italic 12px roboto';
    context.fillText(alfabeto[index], coordenada_normalizada[0] - margin_spaces * 0.3, coordenada_normalizada[1] - (margin_spaces * 0.2));
    context.closePath();

    // cria linha pontilhada horizontal
    context.beginPath();
    context.setLineDash([5, 5]);
    context.moveTo(coordenada_normalizada[0], coordenada_normalizada[1]);
    context.lineTo(ponto_zero[0], coordenada_normalizada[1]);
    context.stroke();
    context.closePath();

    // cria linha pontilhada vertical
    context.beginPath();
    context.moveTo(coordenada_normalizada[0], coordenada_normalizada[1]);
    context.lineTo(coordenada_normalizada[0], ponto_zero[1]);
    context.stroke();
    context.closePath();
    let _direction = [coordenada[0] > 0 ? -1 : 1, coordenada[1] > 0 ? 1 : -1];

    // cria os textos nas absissas e nas ordenadas
    context.font = '9px serif';
    if (labelType == "number") {
      context.fillText(coordenada[0], coordenada_normalizada[0] - (margin_spaces * 0.3), (ponto_zero[1] + ((margin_spaces * 0.1))) + (_direction[1] * 0.02 * ponto_zero[1]));
      context.fillText(coordenada[1], (ponto_zero[0] - (margin_spaces * 0.15)) + (_direction[0] * 0.03 * ponto_zero[0]), coordenada_normalizada[1]);
      context.closePath();

    } else {

      context.fillText('x' + index, coordenada_normalizada[0] - (margin_spaces * 0.3), (ponto_zero[1] + ((margin_spaces * 0.1))) + (_direction[1] * 0.02 * ponto_zero[1]));
      context.fillText('y' + index, (ponto_zero[0] - (margin_spaces * 0.15)) + (_direction[0] * 0.03 * ponto_zero[0]), coordenada_normalizada[1]);
      context.closePath();
    }

    push_legenda_ponto(coordenada, index);
  }

  function push_legenda_ponto(coordenada, index) {
    pontos_criados.push(coordenada);
    context.beginPath();
    context.font = 'italic 11px roboto';
    let line = 2;
    let xindex = index * 50;
    if (index > 3) {
      line = 1;
      xindex = (index - 4) * 60;
    }

    context.fillText(`${alfabeto[index]} = (${coordenada[0] + "," + coordenada[1]})`, (margin_spaces / 2) + (xindex), canvas.height - (margin_spaces / 2) * line);
    context.closePath();

  }

  //soma de vetores
  this.sumVector = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]];

  //subtração de vetores
  this.subVector = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1]];

  //multiplicação de vetores
  this.multVector = (v1, v2) => [v1[0] * v2[0], v1[1] * v2[1]];

  //negação de vetores
  this.negVector = (v1) => [-v1[0], -v1[1]];

  //modulo de um vector
  this.modVector = (v1, v2) => Math.sqrt((Math.abs(v1[0] - v1[0]) ^ 2) + (Math.abs(v1[1] - v1[1]) ^ 2));

  // Cria as linhas no plano apartr das coordenas cartesianas
  this.drawnLines = function (coordenadas, lines) {
    let coordenada_convertidas = coordenadas;

    //percorre as regras das linhas
    lines.forEach((line, index) => {
      /* 
        Para cada coordenada em que a linha referencia, 
        antes de deter a coordenada do quadrante, é somado um valor de direção
        primeira ponto da linha diminui e o segundo um maior
      */
      coordenada_convertidas = coordenada_convertidas.map(
        (coordenada, index) => {
          let direction = 0;
          return converte_primeiro_para_quarto([coordenada[0] + direction, coordenada[1] + direction])
        });

      context.beginPath();
      context.lineWidth = 2;
      context.setLineDash([0, 0]);
      context.moveTo(coordenada_convertidas[line[0]][0], coordenada_convertidas[line[0]][1]);
      context.lineTo(coordenada_convertidas[line[1]][0], coordenada_convertidas[line[1]][1]);
      let coordenada_mediana = [((coordenada_convertidas[line[0]][0] + coordenada_convertidas[line[1]][0]) / 2) - margin_spaces * 0.1, ((coordenada_convertidas[line[0]][1] + coordenada_convertidas[line[1]][1]) / 2)]

      context.font = 'bold 15px roboto';
      context.fillText(alfabeto_for_lines[index] + "=" + (this.modVector(coordenada_convertidas[line[0]], coordenada_convertidas[line[1]])), coordenada_mediana[0], coordenada_mediana[1]);
      // context.fillText(alfabeto_for_lines[index], (margin_spaces/2)+(index*50), canvas.height-margin_spaces*0.4);

      context.stroke();
      context.closePath();
    })
  }

  this.defaultGraph = function () {

    // Flecha triângulo ^
    context.beginPath();
    context.moveTo(ponto_zero[0] - 5, (margin_spaces / 2));
    context.lineTo(ponto_zero[0] + 5, (margin_spaces / 2));
    context.lineTo(ponto_zero[0], (margin_spaces / 2) - 5);
    context.fillText('Y', ponto_zero[0] + 10, (margin_spaces / 2));

    context.fill();

    // cria a linha vertical
    context.moveTo(ponto_zero[0], canvas.height - (margin_spaces));
    context.lineTo(ponto_zero[0], (margin_spaces / 2));

    // cria a linha horizontal  
    context.moveTo(margin_spaces / 2, ponto_zero[1]);
    context.lineTo(canvas.width - (margin_spaces / 2), ponto_zero[1]);
    context.stroke();

    // cria flecha triangular > 
    context.moveTo(canvas.width - (margin_spaces / 2), ponto_zero[1] - 5);
    context.lineTo(canvas.width - (margin_spaces / 2), ponto_zero[1] + 5);
    context.lineTo(canvas.width - (margin_spaces / 2) + 6, ponto_zero[1]);
    context.fillText('X', canvas.width - (margin_spaces / 2), ponto_zero[1] + 15);

    context.fill();

    context.font = 'italic 18px roboto';
    context.fillText(`Pontos no Cartesiano`, canvas.width * 0.1, canvas.height - (margin_spaces * 2));
    context.closePath();




    if (pontoOrigem) {
      //ponto circular no ponto zero
      context.moveTo(ponto_zero[0], ponto_zero[1]);
      context.beginPath();
      context.arc(ponto_zero[0], ponto_zero[1], 2, 0, Math.PI * 2, true);
      context.fill();
      context.closePath();
    }
  }

  let cirlesCollide = [];
  this.tictactoe = () => {

    context.closePath();
    let varint = 12;
    let angleScale = (Math.PI * 2) / varint;

    //context.moveTo(ponto_zero[0], ponto_zero[1]);
    for (let indiceCircle = 1; indiceCircle <= 4; indiceCircle++) {
      context.beginPath();
      context.arc(ponto_zero[0], ponto_zero[1], indiceCircle * escala, 0, 360);
      context.stroke();
      context.closePath();
    }
    for (let lineIndex = 0; lineIndex <= varint; lineIndex++) {
      context.beginPath();
      let baseMath = [Math.cos(lineIndex * angleScale), Math.sin(lineIndex * angleScale)];
      context.moveTo(ponto_zero[0] + baseMath[0] * escala, ponto_zero[1] + baseMath[1] * escala);
      context.lineTo(ponto_zero[0] + baseMath[0] * escala * 4, ponto_zero[1] + baseMath[1] * escala * 4)
      context.stroke();
      context.closePath();

      for (let indiceCircle = 1; indiceCircle <= 4; indiceCircle++) {
        context.beginPath();
        cirlesCollide.push([ponto_zero[0] + baseMath[0] * escala * indiceCircle, ponto_zero[1] + baseMath[1] * indiceCircle * escala])
        context.arc(ponto_zero[0] + baseMath[0] * escala * indiceCircle, ponto_zero[1] + baseMath[1] * indiceCircle * escala, 3, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();

      }
    } context.fill();

    let colors = ["red", "green"];
    let indexColor = 0;
    canvas.addEventListener('click', function (e) {
      var x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;
       let points = cirlesCollide.map((circle, i) => {
        let a = circle[0]-x;
        let b = circle[1]-y;
        return { distance: (Math.sqrt(a * a + b * b)),index:i }
      });
      debugger
      points.sort((a,b)=>{
        return a.distance-b.distance
      })
      if(points[0].distance<60){
        context.beginPath();
        context.fillStyle = colors[indexColor];

        context.arc(cirlesCollide[points[0].index][0]  ,cirlesCollide[points[0].index][1] , 9, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();
        cirlesCollide.splice(points[0].index,1);
        indexColor = (indexColor==0)?1:0;

      }

    });



    // context.addHitRegion({ id: "circle" + indiceCircle + "_" + lineIndex });


  }

  this.showValidAnswers = function (angleScale = (Math.PI * 2) / 12) {
    // linhas de condições de vitória
    let baseMath = [];

    /* condição de vitoria 1 */
    context.beginPath();
    baseMath = [Math.cos(9 * angleScale), Math.sin(9 * angleScale)];
    //desenha os circulos
    context.fillStyle = "red";
    [1, 2, 3, 4].forEach(pointIndex => {
      context.arc(ponto_zero[0] + baseMath[0] * escala * pointIndex, ponto_zero[1] + baseMath[1] * pointIndex * escala, 6, 0, Math.PI * 2, true);
    })
    context.fill();
    context.closePath();

    // desenha a linha
    context.beginPath();
    context.lineWidth = 4;
    context.strokeStyle = "red";
    context.moveTo(ponto_zero[0] + baseMath[0] * escala * 1, ponto_zero[1] + baseMath[1] * 1 * escala);
    context.lineTo(ponto_zero[0] + baseMath[0] * escala * 4, ponto_zero[1] + baseMath[1] * 4 * escala)
    context.stroke();

    context.fill();


    /* condição de vitoria 2 */
    //desenha os circulos
    context.fillStyle = "red";
    let baseMathHistory = [];
    [10, 11, 12, 13].forEach((pointIndex, i, all) => {
      baseMath = [Math.cos(pointIndex * angleScale), Math.sin(pointIndex * angleScale)];

      context.beginPath();
      context.arc(ponto_zero[0] + baseMath[0] * escala * 3, ponto_zero[1] + baseMath[1] * 3 * escala, 6, 0, Math.PI * 2, true);
      context.fill();
      context.closePath();
      if (i > 0) {
        context.beginPath();
        context.lineWidth = 4;
        context.strokeStyle = "red";
        debugger
        context.moveTo(ponto_zero[0] + baseMathHistory[i - 1][0] * escala * 3, ponto_zero[1] + baseMathHistory[i - 1][1] * 3 * escala)
        context.lineTo(ponto_zero[0] + baseMath[0] * escala * 3, ponto_zero[1] + baseMath[1] * 3 * escala)
        context.stroke();
        context.closePath();
      }
      // armazena a posição angular para uso de desenho das linhas
      baseMathHistory.push(baseMath);
    })

    /* condição de vitoria 3 */
    //desenha os circulos
    context.fillStyle = "red";
    baseMathHistory = [];
    [2, 3, 4, 5].forEach((pointIndex, i) => {
      baseMath = [Math.cos(pointIndex * angleScale), Math.sin(pointIndex * angleScale)];

      context.beginPath();
      context.arc(ponto_zero[0] + baseMath[0] * escala * (i + 1), ponto_zero[1] + baseMath[1] * (i + 1) * escala, 6, 0, Math.PI * 2, true);
      context.fill();
      context.closePath();
      if (i > 0) {
        context.beginPath();
        context.lineWidth = 4;
        context.strokeStyle = "red";
        debugger
        context.moveTo(ponto_zero[0] + baseMathHistory[i - 1][0] * escala * (i), ponto_zero[1] + baseMathHistory[i - 1][1] * (i) * escala)
        context.lineTo(ponto_zero[0] + baseMath[0] * escala * (i + 1), ponto_zero[1] + baseMath[1] * (i + 1) * escala)
        context.stroke();
        context.closePath();
      }
      // armazena a posição angular para uso de desenho das linhas
      baseMathHistory.push(baseMath);
    })
  }

  this[graphCartesian]();

  this.clear = function () {
    context.clearRect(0, 0, context.width, context.height);
  }
})
let cartesiano = {};

function drawPlanCartesiano() {

  cartesiano = new Cartesiano("cartesiano", { graphCartesian: "tictactoe", escala: 50 });
  /* 
    Array de pontos cartesianos, cada item da array precisa ter
    coordenadas de X e Y
  */

}

function mostrarRespostasValidas() {
  cartesiano.showValidAnswers();
}

function recarregarCanvas() {
  window.location.reload(false);
}
