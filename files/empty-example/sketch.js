let A, B;
let matrixA = [[ 1, 2, -1, -4],
  		       [ 2, 3, -1,-11],
 			   [-2, 0, -3, 22]];

let matrixB = [[2, 2, 0],
			   [2, -1, 0],
			   [0, 0, 2]];


let doonce = true; // flag pra parar o código

function setup() {
 createCanvas(500, 500);

A = new Matrix(matrixA);
B = new Matrix(matrixB);
}

function draw() {
  background(50);
  fill(255);
  A.drawMatrix(0);
  B.drawMatrix(width / 2);
  if(doonce){
  	let result = [];
  	result = A.echelonForm();
  	console.table(result.mtx);
  	doonce = false;
  }
}



class Matrix{
	constructor(m){
		let mtx = []; // precisa ser iniciado como array antes de receber um array
		this.mtx = m;
		this.c = this.mtx[0].length;
		this.r = this.mtx.length;
		
		this.isSquare = (this.c == this.r);
		if(this.isSquare){
			this.det = this.determinant(this.mtx);
			this.tr = this.trace();
		}
	}

	drawMatrix(x){
		let cellSize = 40;
		let margin = 40;
		for(let i = 0; i < this.r; i++){
			for( let j = 0; j < this.c; j++){
				text(this.mtx[i][j], cellSize * (j) + x + margin, cellSize * (i) + margin);
			}
		}
		if(!this.isSquare) return;
		text(this.det, this.c/2 * cellSize + x, 200);
	}

	multiply(m){
		if(this.c != m.r) {
			console.log("número de colunas de A deve ser igual ao de linhas de B");
			return null; // colunas(c) de A devem ter a mesma dimensão de linhas(r) de B
		}
		let result = [];
		for(let i = 0; i < this.r; i++){
			let row = [];
			result.push(row);
			for(let j = 0; j < m.c; j++){
				let sum = 0;
				for(let a = 0; a < this.c; a++){
					sum += this.mtx[i][a] * m.mtx[a][j];
				}
				result[i][j] = sum;
			}
		}
		let productM = new Matrix(result);
		return productM;
	}

	determinant(m){ // recebe mtx
		let det = 0;
		if(m.length <= 2){
			// let det = 0;
			det = m[0][0] * m [1][1] - m[0][1] * m[1][0];
			
		}
		else {
			// let det = 0;
			let coeficients = []; // encontra os coefs...
			coeficients = m[0]; // na primeira linha da matriz

			for(let c = 0; c < coeficients.length; c++){
				let reducedMatrix = [];

				for(let i = 1; i < m.length; i++){ // ignora a linha do coeficiente
					let row = [];

					for(let j = 0; j < m.length; j++){
						if(j == c) continue; // ignora a coluna do coeficiente
						row.push(m[i][j]); // recolhe elementos para a matriz reduzida, linha por linha
					}
					reducedMatrix.push(row); // recolhe as linhas da matriz reduzida
				}
				let signal = 1;
				if(c & 1) signal = -1;
				det += coeficients[c] * this.determinant(reducedMatrix) * signal;
			}
		}
		return det;
	}

	trace(){
		let sum = 0;
		for(let i = 0; i < this.r; i++){
			sum += this.mtx[i][i];
		}
		return sum;
	}

	escalarMult(a){
		let result = [];
		for(let i = 0; i < this.r; i++){
			let row =[];
			for(let j = 0; j < this.c; j++){
				row.push(this.mtx[i][j] * a);
			}
			result.push(row);
		}
		let aEscalarM = new Matrix(result);
		return aEscalarM;
	}

	addMatrix(M){
		if(M.r != this.r || M.c != this.c){
			console.log("dimensões diferentes");
			return null;
		}

		let result = [];
		for(let i = 0; i < this.r; i++){
			let row = [];
			for(let j = 0; j < this.c; j++){
				row[j] = this.mtx[i][j] + M.mtx[i][j];
			}
			result.push(row);
		}
		let R = new Matrix(result);
		return R;
	}

	transpose(){
		let result = [];
		for(let i = 0; i < this.r; i++){
			let col = [];
			for(let j = 0; j < this.c; j++){
				col[j] = this.mtx[j][i];
			}
			result.push(col);
		}
		let aTransp = new Matrix(result);
		return aTransp;
	}

	augmentedForm(){

	}

	echelonForm(){
		let M = [];
		M = copyMatrix(this); // clonar é amar
		let lead = 0; // índice de navegação horizontal

    	for(let i = 0; i < this.r; i++){ //organizar linhas por escala
    		if(this.c <= lead) return; // sair se o índice horizontal for além das colunas
    		let r = i; // índice de navegação vertical

    		while(M[r][lead] == 0){ // Procurar um pivot...
    			r++; // ...verticalmente,

    			if(this.r == r){ // se o índice vertical for além das linhas...
    				r = i; // ...voltar para a linha inicial...
    				lead++; // ...e procurar na próxima coluna

    				if(this.c == lead) return; // sair se o índice horizontal for além das colunas
    			}
    		} // Se chegou até aqui, foi encontrado um pivot
    		swapRows(M, r, i); // troca a linha do pivot pela linha da escala atual

    		if(M[i][lead] != 0){ // Apenas se o pivot não for zero...
    			multiplyRow(M[i], 1/M[i][lead]); // divide a linha da escala atual pelo valor do seu pivot
    		}	

    		for(let h = 0; h < this.r; h++){ // Linha por linha...
    			if(h == i) continue; // ...pulando a linha da escala atual...
    			//let val = M[h][lead];
    			addRows(M[h], M[i], 1, -M[h][lead]);  	// addRows(M[h], M[i], 1, -val); 		
    		} // subtrai de cada linha da matriz o produto de seu pivot e da linha da escala atual
    		lead++; // avança horizontalmente
    	}
    	let result = new Matrix(M); //produz uma matriz resultado do escalonamento
    	return result;
    }
      
}

function swapCols(M, c1, c2){
	
}

function swapRows(M, r1, r2){
	let rowAux = [];
	rowAux = M[r1];
	M[r1] = M[r2];
	M[r2] = rowAux;
}

function multiplyRow(V, scalar){
	for(let i = 0; i < V.length; i++){
		V[i] *= scalar;
	}
}

function addRows(V, R, scalarV, scalarR){
	for(let i = 0; i < V.length; i++){
		V[i] = V[i] * scalarV + R[i] * scalarR;
	}
}

function createRandomMatrix(n, m, minV, maxV){
	let M = [];
	for(let i = 0; i < n; i++){
		let row = [];
		for(let j = 0; j < m; j++){
			row.push(round(random() * (maxV - minV) + minV));
		}
		M.push(row);
	}
	let result = new Matrix(M);
	return result;
}

function createIdentityMatrix(n){
	let M = [];
	for(let i = 0; i < n; i++){
		let row = [];
		for(let j = 0; j < n; j++){
			if(i == j) row.push(1);
			else row.push(0);
		}
		M.push(row);
	}
	let result = new Matrix(M);
	return result;
}

function copyMatrix(M){
	console.table(M.mtx);
	let rows = M.r;
	let cols = M.c;
	let result = [];
	for(let i = 0; i < rows; i++){
		let newR = [];
		for(let j = 0; j < cols; j++){
			newR[j] = M.mtx[i][j];
		}
		result.push(newR);
	}
	return result;
}