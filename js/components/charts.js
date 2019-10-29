import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class charts {
	constructor(params) {
		this.pixelRatio = (window.devicePixelRatio) ? window.devicePixelRatio : 1;

		let container = dce({el: 'DIV'});

		let canvas = dce({
			el: 'CANVAS', 
			attrbs: [['width', this.pixelRatio*320], ['height', this.pixelRatio*320]],
			cssStyle: 'width: 320px; height: 320px;'
			});

		this.ctx = canvas.getContext ( '2d' );

		canvas.x = this.pixelRatio*320 / 2;
		canvas.y = this.pixelRatio*320 / 2;

		this.canvas = canvas;

		let max = 2 / 100 ;

		let a = 0, b = 0;

		this.ctx.clearRect(0,0,320*this.pixelRatio,320*this.pixelRatio);
		this.ctx.beginPath();
		let strokeWidth =50;
		let radius = 160-strokeWidth/2*this.pixelRatio;
		b = 25;

		for( let i = 0, j = params.data.length; i < j ; i ++ ) {
			a = params.data[i];
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

		let legendsContainer = dce({el: 'DIV'});
		for( let i = 0, j = params.labels.length; i < j ; i ++ ) {
			legendsContainer.appendChild(dce({el: 'DIV', content: `${params.labels[i]} : ${params.data[i]} `, cssStyle: `color : ${params.colors[i]}`}))
		}

		container.append(this.canvas, legendsContainer)

		this.render = () => {
			return container;
		}
	}
}
export default charts;
//fpTimer.init();
