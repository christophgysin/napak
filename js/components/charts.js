import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class charts {
	constructor(params) {
		this.pixelRatio = (window.devicePixelRatio) ? window.devicePixelRatio : 1;

		let container = dce({el: 'DIV'});

		let canvasHeight = (params.chartHeight) ? params.chartHeight : 320;
		// Setup canvas
		let canvas = dce({
			el: 'CANVAS', 
			attrbs: [['width', this.pixelRatio*320], ['height', this.pixelRatio*canvasHeight]],
			cssStyle: `width: 320px; height: ${canvasHeight}px;`
			});

		this.ctx = canvas.getContext ( '2d' );
		canvas.x = this.pixelRatio*320 / 2;
		canvas.y = this.pixelRatio*canvasHeight / 2;
		this.canvas = canvas;

// Pie chart
		this.pie = () => {
			let max = 2 / 100 ;
			let a = 0, b = 0;

			let temp = params.data;
			const total = temp.reduce((a,b) => a + b, 0);

			this.ctx.clearRect(0,0,320*this.pixelRatio,canvasHeight*this.pixelRatio);
			this.ctx.beginPath();
			let strokeWidth =canvasHeight/10*this.pixelRatio;
			let radius = canvasHeight/2*this.pixelRatio-strokeWidth/2*this.pixelRatio;
			b = 25;


			for( let i = 0, j = params.data.length; i < j ; i ++ ) {
				a = 100/total * params.data[i];
				let startAngle = (2-(max*b)) * Math.PI;
				let endAngle = (2-(max*(b+a))) * Math.PI;
				let counterClockwise = true;
				this.ctx.beginPath();
				this.ctx.arc(this.canvas.x, this.canvas.y, radius, startAngle, endAngle, counterClockwise);
				this.ctx.lineWidth = strokeWidth;
				this.ctx.strokeStyle = params.colors[i] ;
				this.ctx.stroke();
				b = b+a;
				}
			this.ctx.closePath();

			let legendsContainer = dce({el: 'DIV', cssStyle: 'display: flex; justify-content: space-between'});
			for( let i = 0, j = params.labels.length; i < j ; i ++ ) {
				legendsContainer.appendChild(dce({el: 'DIV', content: `${params.labels[i]} : ${params.data[i]} `, cssStyle: `color : ${params.colors[i]}`}))
			}

		container.append(this.canvas, legendsContainer)
		}

// Bar chart
		this.barchart = () => {
			let chartHeight = 160;
			let xAxisHeight = 20;
			let totalHeight = chartHeight+xAxisHeight;
			this.ctx.clearRect(0,0,320*this.pixelRatio,totalHeight*this.pixelRatio);
			this.ctx.beginPath();
			let strokeWidth =10;
			let roundCaps = strokeWidth / 2;
			let yMax = Math.max(...params.data);
			let yMaxRoundUp = Math.ceil(yMax / 10) * 10;

			this.ctx.lineCap = 'round';

			// Draw boundaries
			let yAxis = chartHeight * this.pixelRatio / (yMaxRoundUp / 10);
			let yAxisTotal = chartHeight * this.pixelRatio / yAxis;

			this.ctx.setLineDash([5, 15]);
			this.ctx.strokeStyle = 'rgba(255,255,255,.8)';

			for(let i=0, j = yAxisTotal+1; i<j; i++) {
				this.ctx.beginPath();
				this.ctx.moveTo(20,yAxis*i);
				this.ctx.lineTo(300 * this.pixelRatio, yAxis*i);
				if(i === j-1 ) {this.ctx.setLineDash([]);}
				this.ctx.stroke();
			}

			this.ctx.fillStyle = (params.color) ? params.colors[i] : 'rgba(255,255,255,.8)';
			this.ctx.font = "13px IBM Plex Mono";
			this.ctx.lineWidth = 1;

			for(let i=0, j = yAxisTotal+1; i<j; i++) {
				this.ctx.fillText(yMaxRoundUp-i*10,0,(yAxis*i) + 6.5, 20);
			}

// draw bars
			for( let i = 0, j = params.data.length; i < j ; i ++ ) {
				this.ctx.beginPath();
				this.ctx.moveTo(
					20 + i * this.pixelRatio* 300 / params.data.length + strokeWidth / 2, 
					this.pixelRatio * chartHeight - roundCaps
					);
				this.ctx.lineTo(
					20 + i * this.pixelRatio * 300 / params.data.length + strokeWidth / 2, 
					(this.pixelRatio * chartHeight - roundCaps) - ((chartHeight/yMaxRoundUp * params.data[i])-roundCaps)*this.pixelRatio)
				this.ctx.lineWidth = strokeWidth;

				this.ctx.strokeStyle = (params.color) ? params.colors[i] : getComputedStyle(document.documentElement).getPropertyValue('--color-flash');
				if(params.data[i]) {
					this.ctx.stroke();
					}
				}
			this.ctx.closePath();

			this.ctx.fillStyle = (params.color) ? params.colors[i] : 'rgba(255,255,255,.8)';
			this.ctx.font = "13px IBM Plex Mono";
			this.ctx.lineWidth = 1;
			for( let i = 0, j = params.xaxis.length; i < j ; i ++ ) {
				this.ctx.fillText(params.xaxis[i],20 + i * this.pixelRatio* 300 / params.data.length,totalHeight*this.pixelRatio);
			}
		container.append(this.canvas)
		}

		if(params.type === 'pie') {this.pie();}
		if(params.type === 'barchart') {this.barchart();}
		
		this.render = () => {
			return container;
		}
	}
}
export default charts;
//fpTimer.init();
