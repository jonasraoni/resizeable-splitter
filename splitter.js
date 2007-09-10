/*
 * Resizeable Splitter: A resizeable splitter panel manager
 * Jonas Raoni Soares da Silva <http://raoni.org>
 * https://github.com/jonasraoni/resizeable-splitter
 */

Splitter = function(container, type){
	this.constructor();
	this.id = Splitter.list.push(this);
	this.type = type;
	this.element = (this.container = container).appendChild(document.createElement("div"));
	this.element.style.position = "relative";
};
with({o: Splitter.prototype = new Node}){
	o.resizer = o.type = null;
	Splitter.HORIZONTAL = (Splitter.VERTICAL = 0) + 1;
	Splitter.list = [];
	Splitter.getSplitterById = function(id){
		return this.list[id] || null;
	};
	o.toString = function(){
		return "[object Splitter #" + this.id + "]";
	};
	o.setSize = function(o){
		var map = {w: "width", h: "height", l: "left", t: "top"}, i, x;
		for(i in o){
			x = this.element.parentNode["offset" + i.toUpperCase() + map[i].slice(1)] || 1;
			this.element.style[map[i]] = o[i] / x * 100 + "%";
		}
	};
	o.getSize = function(){
		var b = this.element;
		return {w: b.offsetWidth, h: b.offsetHeight, l: b.offsetLeft, t: b.offsetTop};
	};
	o.add = function(block, before){
		var e = block.element, v;
		this.constructor.prototype.add.call(this, block, before ? this.find(before) + 1 : null);
		block.attachTo(this.element, before ? before.element.nextSibling : null);
		v = this.type == Splitter.VERTICAL ? "left" : "none";
		e.style.styleFloat = v;
		e.style.cssFloat = v;
	};
	o.remove = function(block){
		this.constructor.prototype.remove.call(this, block);
		var o = this.items[0], oe = o.element, os = oe.style, e = this.element, es = e.style;
		os.width = es.width;
		os.height = es.height;
		os.styleFloat = es.styleFloat;
		os.cssFloat = es.cssFloat;
		e.nextSibling ? e.parentNode.insertBefore(oe, e.nextSibling) : e.parentNode.appendChild(oe);
		this.parent && (this.parent.resizer[this.parent.resizer.left == this ? "left" : "right"] = o);
		this.replace(o);
		e.parentNode.removeChild(e);
		block.resizer.fix();
	}
}