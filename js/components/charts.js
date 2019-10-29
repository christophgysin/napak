import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class charts {
  constructor(params) {
	this.colorTable = [
		'rgba(255,0,0,1)',
		'rgba(0,255,0,1)',
		'rgba(0,0,255,1)',
		'rgba(255,0,255,1)',
		'rgba(255,255,0,1)'];

	this.dataSet = [10, 20, 30, 40];

	this.pixelRatio = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
//	dataSet : [0, 10, 20, 30, 40 ], // circles

	let canvas = document.createElement ( "CANVAS" );
	canvas.width = this.pixelRatio*320;
	canvas.height = this.pixelRatio*320;

	canvas.style.width = "320px";
	canvas.style.height = "320px";

	this.ctx = canvas.getContext ( '2d' );

	canvas.x = canvas.width / 2;
	canvas.y = canvas.height / 2;

	this.canvas = canvas;
//	this.animate = () => {
		// 100% equals 2 in canvas arc
		var max = 2 / 100 ;

		var a = 0;
		var b = 0;
		var c = 0;

		this.ctx.clearRect(0,0,320*this.pixelRatio,320*this.pixelRatio);
		// White background
		this.ctx.beginPath();
		let radius = 60*this.pixelRatio;
		b = 25;

		for ( var i = 0, j = this.dataSet.length; i < j ; i ++ ) {
			a = this.dataSet [ i ];
			var startAngle = (2-(max*b)) * Math.PI;
			var endAngle = (2-(max*(b+a))) * Math.PI;
			var counterClockwise = true;
			this.ctx.beginPath();
			this.ctx.arc(this.canvas.x, this.canvas.y, radius, startAngle, endAngle, counterClockwise);
			this.ctx.lineWidth = 12;
			this.ctx.strokeStyle = this.colorTable[i] ;
			this.ctx.stroke();
			b = b+a;
			}
		this.ctx.closePath();
//		}

		this.render = () => {
			return this.canvas;
		}
	}
}
export default charts;
//fpTimer.init();
