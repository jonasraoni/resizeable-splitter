/*
 * Resizeable Splitter: A resizeable splitter panel manager
 * Jonas Raoni Soares da Silva <http://raoni.org>
 * https://github.com/jonasraoni/resizeable-splitter
 */

Tree = function(){
	(this.root = new Node).owner = this;
};
with({o: Tree.prototype}){
	o.root = null;
	o.toString = function(){
		return "[object Tree]";
	};
	o.setRoot = function(node){
		this.root = node;
		node.owner = this;
		node.parent = null;
	};
};

Node = function(){
	this.items = [];
};
with({o: Node.prototype}){
	o.owner = o.data = o.parent = o.items = null;
	o.toString = function(){
		return "[object Node]";
	};
	o.replace = function(node){
		var p = node.parent = this.parent;
		p ? p.items[p.find(this)] = node : this.owner.setRoot(node);
		node.owner = this.owner;
		this.parent = null;
		return this;
	};
	o.find = function(node){
		for(var o = this.items, i = o.length; i-- && o[i] !== node;);
		return i;
	};
	o.remove = function(node){
		return this.items.splice(this.find(node), 1)[0];
	};
	o.add = function(node, index){
		node.parent && node.parent.remove(node);
		node.owner = this.owner;
		node.parent = this;
		typeof index == "number" ? this.items.splice(index, 0, node) : this.items.push(node);
		return node;
	};
	o.each = function(c){
		if(!c) return;
		for(var o = this.items, i = o.length; i--; c(o[i]));
	};
	o.getLevel = function(){
		for(var o = this, level = 0; o = o.parent; ++level);
		return level;
	};
}