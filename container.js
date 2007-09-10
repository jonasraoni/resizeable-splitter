/*
 * Resizeable Splitter: A resizeable splitter panel manager
 * Jonas Raoni Soares da Silva <http://raoni.org>
 * https://github.com/jonasraoni/resizeable-splitter
 */

Container = function(container){
	var t = this.structure = new Tree;
	t.setRoot(n = new Block);
	t.root.attachTo(this.container = container);
}
with({o: Container.prototype}){
	o.container = o.structure = o.selected = null;
	o.toString = function(){
		return "[object Container]";
	};
	o.prepareBlock = function(n){
		addEvent(n, "remove", this.removeHandler, this);
		addEvent(n, "split", this.splitHandler, this);
		addEvent(n.element, "mousedown", this.downHandler, {layout: this, block: n});
		addEvent(n.element, "click", this.clickHandler, {layout: this, block: n});
		this.callEvent("onadd", n);
	};
	o.build = function(data){
		n.setSize({w: data.width, h: data.height});
		this.add(data.root, n);
	};
	o.add = function(d, n){
		if(d.type == 0){
			n.setSize({w: d.width, h: d.height});
			//console.log(n.parent.getSize().h);
			//n.parent.element.style.border = "3px solid";
			//console.log(n.parent.getSize().h);
			n.data = d.data;
			this.prepareBlock(n);
		}
		else{
			for(var x = n, o = d.children, i = 0, l = o.length; ++i < l;){
				x = x.split(d.type != 1);
				this.callEvent("onsplit", x.parent);
				this.add(o[i], x);
			}
			n.setSize(d.type == 1 ? {h: o[0].height} : {w: o[0].width});
			d.type != 1 ? n.resizer.element.style.left = n.getSize().w : n.resizer.element.style.top = n.getSize().h;
			this.add(o[0], n);
		}
	};
	o.hitTest = function(o, l){
		function getOffset(o){
			for(var r = {l: o.offsetLeft, t: o.offsetTop, r: o.offsetWidth, b: o.offsetHeight};
				o = o.offsetParent; r.l += o.offsetLeft, r.t += o.offsetTop);
			return r.r += r.l, r.b += r.t, r;
		}
		for(var b, s, r = [], a = getOffset(o), j = isNaN(l.length), i = (j ? l = [l] : l).length; i;
			b = getOffset(l[--i]), (a.l == b.l || (a.l > b.l ? a.l <= b.r : b.l <= a.r))
			&& (a.t == b.t || (a.t > b.t ? a.t <= b.b : b.t <= a.b)) && (r[r.length] = l[i]));
		return j ? !!r.length : r;
	};
	o.splitHandler = function(o){
		this.prepareBlock(o);
		this.callEvent("onsplit", o.parent);
	};
	o.removeHandler = function(node){
		if(this.selected == node)
			this.selected = null, this.callEvent("onunselect", node);
		this.callEvent("onremove", node);
	};
	o.clickHandler = function(evt){
		if(this.layout.selected){
			if(this.layout.selected == this.block){
				this.layout.selected = null;
				this.layout.callEvent("onunselect", this.block);
				return;
			}
			var o = this.layout.selected;
			this.layout.callEvent("onunselect", o);
		}
		this.layout.callEvent("onselect", this.layout.selected = this.block);
	};
	o.downHandler = function(evt){
		var e = this.block.element, o = this.block.element.cloneNode(true), d, h;
		o.style.height = e.offsetHeight;
		o.style.width = e.offsetWidth;
		this.layout.container.appendChild(o);
		d = new Dragger(o);
		d.start(true);
		addEvent(document, "mouseup", this.layout.upHandler, {dragger: d, layout: this.layout, block: this.block});
		this.layout.callEvent("onstartdrag", this.block, d);
	};
	o.upHandler = function(e){
		this.dragger.stop();
		removeEvent(document, "mouseup", arguments.callee, this);
		var d = this.dragger.object, w = window, b = document.body, pt = {offsetLeft: e.clientX + (w.scrollX || b.scrollLeft || b.parentNode.scrollLeft || 0),
		offsetTop: e.clientY + (w.scrollY || b.scrollTop || b.parentNode.scrollTop || 0),
		offsetWidth: 0, offsetHeight: 0, offsetParent: d.offsetParent};

		for(var max, o, x = [this.layout.structure.root], l = []; x.length;){
			if((o = x.pop()) instanceof Splitter)
				for(var i = o.items.length; i--; x.push(o.items[i]));
			else if(this.layout.hitTest(pt, o.element)){
				this.block.exchange(o);
				this.layout.callEvent("onexchange", this.block, o);
				break;
			}
		}
		d.parentNode.removeChild(d);
		this.layout.callEvent("onstopdrag", this.block, this.dragger);
	};
	o.callEvent = function(e){
		var $ = this;
		return $[e] instanceof Function ? $[e].apply($, [].slice.call(arguments, 1)) : undefined;
	};
}