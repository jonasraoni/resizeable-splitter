/*
 * Resizeable Splitter: A resizeable splitter panel manager
 * Jonas Raoni Soares da Silva <http://raoni.org>
 * https://github.com/jonasraoni/resizeable-splitter
 */

Resizer = function(container, type, left, right){
	var $ = this, e = $.element = ($.container = container).appendChild(document.createElement("div")),
	s = e.style, v = type == Splitter.VERTICAL;
	$.size = Resizer.SIZE, $.left = left, $.right = right;
	e.className = "resizer";
	s.position = "absolute";
	s.fontSize = "1px";
	s.top = !v ? "50%" : "0";
	s.left = v ? "50%" : "0";
	s["margin" + (v ? "Left" : "Top")] = "-" + ($.size >> 1) + "px";
	s.height = v ? "100%" : $.size + "px";
	s.width = !v ? "100%" : $.size + "px";
	//- idiot workaround for IE to update the vertical resizer bar
	v && (this.fix.l ? this.fix.l.push(this) : this.fix.l = [this], this.fix());

	$.dragger = new Dragger(e, true);
	$.dragger.addFilter($[(v ? "v" : "h") + "Filter"], $);
	$.dragger.onstop = function(){
		var ls = $.left.getSize(), rs = $.right.getSize(),
		d = v ? e.offsetLeft - ls.l : t = e.offsetTop - ls.t, p;
		p = Math.round((d + ($.size >> 1)) / (p = e.parentNode["offset" + (v ? "Width" : "Height")] || 1) * 100);
		$.left.element.style[v ? "width" : "height"] = e.style[v ? "left" : "top"] = p + "%";
		$.right.element.style[v ? "width" : "height"] = 100 - p + "%";
		$.fix();
	};
};
with({o: Resizer.prototype}){
	Resizer.SIZE = 10;
	o.container = o.dragger = o.left = o.right = o.type = null;
	(o.fix = function(){
		for(var o = arguments.callee.l, i = o.length; i--;){
			o[i].element.offsetHeight;
			o[i].element.style.height = "101%";
			o[i].element.style.height = "100%";
		}
	}).l = [];
	o.toString = function(){
		return "[object Resizer]";
	};
	o.adjust = function(v, min, max){
		return v < min ? min : v > max ? max : v;
	};
	o.hFilter = function(r){
		var left = r.left, right = r.right, o = r.container, min = left.element.offsetTop,
		max = right.element.offsetTop + right.element.offsetHeight - r.size;
		this.x = r.element.offsetLeft;
		this.y = r.adjust(this.y, min, max) + (r.size >> 1);
	};
	o.vFilter = function(r){
		var left = r.left, right = r.right, o = r.container, min = left.element.offsetLeft,
		max = right.element.offsetLeft + right.element.offsetWidth - r.size;
		this.x = r.adjust(this.x, min, max) + (r.size >> 1);
		this.y = r.element.offsetTop;
	};
}