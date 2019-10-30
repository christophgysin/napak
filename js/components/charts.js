import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class charts {
	constructor(params) {
		this.pixelRatio = (window.devicePixelRatio) ? window.devicePixelRatio : 1;

		let container = dce({el: 'DIV'});

		// Setup canvas
		let canvas = dce({
			el: 'CANVAS', 
			attrbs: [['width', this.pixelRatio*320], ['height', this.pixelRatio*320]],
			cssStyle: 'width: 320px; height: 320px;'
			});

		this.ctx = canvas.getContext ( '2d' );
		canvas.x = this.pixelRatio*320 / 2;
		canvas.y = this.pixelRatio*320 / 2;

		this.canvas = canvas;

// Pie chart
		this.pie = () => {
			let max = 2 / 100 ;
			let a = 0, b = 0;

			let temp = params.data;
			const total = temp.reduce((a,b) => a + b, 0);

			this.ctx.clearRect(0,0,320*this.pixelRatio,320*this.pixelRatio);
			this.ctx.beginPath();
			let strokeWidth =50*this.pixelRatio;
			let radius = 160*this.pixelRatio-strokeWidth/2*this.pixelRatio;
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
			this.ctx.clearRect(0,0,320*this.pixelRatio,320*this.pixelRatio);
			this.ctx.beginPath();
			let strokeWidth =10;
			let yMax = Math.max(...params.data);
			let yMaxRoundUp = Math.ceil(yMax / 10) * 10;

			// Draw boundaries
			let yAxis = 300 * this.pixelRatio / (yMaxRoundUp / 10);
			let yAxisTotal = 300 * this.pixelRatio / yAxis;

			this.ctx.setLineDash([5, 15]);
			this.ctx.strokeStyle = 'rgba(255,255,255,.8)';

			for(let i=0, j = yAxisTotal; i<j; i++) {
				this.ctx.beginPath();
				this.ctx.moveTo(0,yAxis*i);
				this.ctx.lineTo(320 * this.pixelRatio, yAxis*i);
				this.ctx.stroke();
			}

			this.ctx.setLineDash([]);
			for( let i = 0, j = params.data.length; i < j ; i ++ ) {
				this.ctx.beginPath();
				this.ctx.moveTo(i * this.pixelRatio* 320 / params.data.length + strokeWidth / 2, this.pixelRatio * 300 );
				this.ctx.lineTo(i * this.pixelRatio * 320 / params.data.length + strokeWidth / 2, this.pixelRatio * 300-(yAxis/yMaxRoundUp * params.data[i])*this.pixelRatio)
				this.ctx.lineWidth = strokeWidth;

				this.ctx.strokeStyle = (params.color) ? params.colors[i] : getComputedStyle(document.documentElement).getPropertyValue('--color-flash');
				if(params.data[i]) {
					this.ctx.stroke();
					}
				}
			this.ctx.closePath();

			this.ctx.strokeStyle = (params.color) ? params.colors[i] : 'rgba(255,255,255,.8)';
			this.ctx.font = "13px IBM Plex Mono";
			this.ctx.lineWidth = 1;
			for( let i = 0, j = params.xaxis.length; i < j ; i ++ ) {
				this.ctx.strokeText(params.xaxis[i],i * this.pixelRatio* 320 / params.data.length,320*this.pixelRatio);
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
