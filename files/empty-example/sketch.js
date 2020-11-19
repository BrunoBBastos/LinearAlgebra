let A, B;
let matrixA = [[ 1, 2, -1, -4],
  		       [ 2, 3, -1,-11],
 			   [-2, 0, -3, 22]];

let matrixB = [[4, 3, 0],
			   [1, 3, 2],
			   [0, -1, 0]];


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
  	console.table(result.elements);
  	doonce = false;
  }
}



class Matrix{
	constructor(m){
		let elements = []; // precisa ser iniciado como array antes de receber um array
		this.elements = m;
		this.c = this.elements[0].length;
		this.r = this.elements.length;
		
		this.isSquare = (this.c == this.r);
		if(this.isSquare){
			this.det = this.determinant(this.elements);
			this.tr = this.trace();
		}
	}

	drawMatrix(x){
		let cellSize = 40;
		let margin = 40;
		for(let i = 0; i < this.r; i++){
			for( let j = 0; j < this.c; j++){
				text(this.elements[i][j], cellSize * (j) + x + margin, cellSize * (i) + margin);
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
					sum += this.elements[i][a] * m.elements[a][j];
				}
				result[i][j] = sum;
			}
		}
		let productM = new Matrix(result);
		return productM;
	}

	determinant(m){ // recebe elements
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
			sum += this.elements[i][i];
		}
		return sum;
	}

	escalarMult(a){
		let result = [];
		for(let i = 0; i < this.r; i++){
			let row =[];
			for(let j = 0; j < this.c; j++){
				row.push(this.elements[i][j] * a);
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
				row[j] = this.elements[i][j] + M.elements[i][j];
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
				col[j] = this.elements[j][i];
			}
			result.push(col);
		}
		let aTransp = new Matrix(result);
		return aTransp;
	}

	// echelonForm(){
	// 	let M = [...this.elements]; // clonning is caring
	// 	let echelon = 0;
	// 	// encontrar pivô
	// 	for(let j = 0; j < this.c; j++){
	// 		for(let i = 0 + echelon; i < this.r; i++){
	// 			if(M[i][j] != 0){
	// 				//verificar se está no topo da matriz
	// 				if(i != echelon){
	// 					swapRows(M, echelon, i);
	// 					echelon++;
	// 				}
	// 			}
	// 		}
	// 	}

	// 	let result = new Matrix(M);
	// 	return result;
	// }

	echelonForm(){
		let M = [...this.elements]; // clone
		let lead = 0; //lead := 0

    //rowCount := the number of rows in M
    //columnCount := the number of columns in M
    	for(let i = 0; i < this.r; i++){ //for 0 ≤ r < rowCount do
    		console.table(M);

    		if(this.c <= lead) return; //if columnCount ≤ lead then stop
    		let r = i; //i = r

    		while(M[r][lead] == 0){ //while M[i, lead] = 0 do
    			r++; //i = i + 1

    			if(this.r == r){ // if rowCount = i then
    				r = i; // i = r
    				lead++; // lead = lead + 1

    				if(this.c == lead) return; //if columnCount = lead then stop
    			}
    		}
    		swapRows(M, r, i); //  Swap rows i and r

    		if(M[i][lead] != 0){ //If M[r, lead] is not 0
    			multiplyRow(M[i], 1/M[i][lead]); // divide row r by M[r, lead]
    		}	

    		for(let h = 0; h < this.r; h++){ //for 0 ≤ i < rowCount do
    			if(h == i) continue;
    			let val = M[r][lead];
    			addRows(M[r], M[i], 1, -val);  			
    		}
    		lead++; //lead = lead + 1
    	}
    	let result = new Matrix(M);
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