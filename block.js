/*
 * Resizeable Splitter: A resizeable splitter panel manager
 * Jonas Raoni Soares da Silva <http://raoni.org>
 * https://github.com/jonasraoni/resizeable-splitter
 */

Block = function(){
	var o = this;
	o.constructor();
	(o.element = document.createElement("div")).style.overflow = "auto";
	o.id = Block.list.push(this);
};
with({o: Block.prototype = new Node}){
	o.container = o.element = o.resizer = o.id = null;
	Block.list = [];
	Block.getBlockById = function(id){
		return this.list[id] || null;
	};
	o.remove = function(){
		if(this.parent){
			this.parent.remove(this);
			this.onremove && this.onremove(this);
		}
	};
	o.toString = function(){
		return "[object Block #" + this.id + "]";
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
	o.split = function(v){
		var b = new Block, t = v ? Splitter.VERTICAL : Splitter.HORIZONTAL,
		s = new Splitter(this.container, t), e = s.element, n = ["width", "height"];
		e.style.width = this.element.style.width;
		e.style.height = this.element.style.height;
		if(p = this.parent){
			p.element.insertBefore(e, this.element);
			if(p.type == Splitter.VERTICAL)
				e.style.styleFloat = e.style.cssFloat = "left";
		}
		b.element.style[n[+!v]] = this.element.style[n[+!v]] = "50%";
		b.element.style[n[+v]] = this.element.style[n[+v]] = "100%";
		this.replace(s);
		s.add(this);
		s.add(b);
		this.resizer && (this.resizer[this.resizer.left == this ? "left" : "right"] = s);
		s.resizer = b.resizer = this.resizer = new Resizer(e, t, this, b);
		this.onsplit && this.onsplit(b, this);
		return b;
	};
	o.exchange = function(n){
		var o = this, exchange = function(a, b, p){var o = a[p]; a[p] = b[p], b[p] = o;}, x, i;
		if(n == o)
			return;
		if(o.resizer == n.resizer){
			x = [o, n], i = o.resizer.left == o;
			o.resizer.left = x[i ^ 0], o.resizer.right = x[i ^ 1];
		}
		else{
			o.resizer && (o.resizer[o.resizer.left == o ? "left" : "right"] = n);
			n.resizer && (n.resizer[n.resizer.left == n ? "left" : "right"] = o);
			exchange(o, n, "resizer");
		}

		var p = n.parent, i = p.find(n), a = o.element, b = n.element, x = b.nextSibling, c = b.parentNode;
		a.parentNode.insertBefore(b, a);
		x ? c.insertBefore(a, a == x ? b : x) : c.appendChild(a);

		exchange(a = a.style, b = b.style, "styleFloat");
		exchange(a, b, "cssFloat");
		exchange(a, b, "height");
		exchange(a, b, "width");

		o.replace(n);
		(o.parent = p).items[i] = o;
	}
	o.attachTo = function(container, before){
		var e = this.element, c = this.container = container;
		before ? c.insertBefore(e, before) : c.appendChild(e);
	};
}