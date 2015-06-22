//实现koa的app.use中间件方法，
//并且修改this指向，在koa中为ctx
//koa中每个next实际上为generator iterator
//这里的实现是funcation
//所以koa里面还可以用yield *next
let app = {
  version: "0.1",
  _middleware:[],
  use(fn){
  	this._middleware.push(fn);
  },
  next(){
  	let mw = this._middleware;
    let len = mw.length;
    let index = 0;
    let fn = (index) =>{
      if(index < len){
      	let item = mw[index++].call(this,fn);
        if(item != null){
          for(let callback of item){
          	callback(index);
          }
        }
      }
    };
    
    fn(index);
  },
  start(){
  	this.next();
  }
};

/**----------------测试--------------------**/
app.use(function* (next){
   console.log("begin");
   yield next;
   console.log("begin again");
   yield next;
   console.log("end");
});

app.use(function* (next){
  	console.log("T_T");
    if(Math.random() < 0.5){
    	yield next;
    }
});

app.use(function* (){
	console.log(this.version);
});

app.start();

