function Cache(config){
	var obj={};
	var that=this;
	var caching_enabled=(config.enabled=='Y'?true:false);
	var server_type=config.server_type;
	var server=config.servers;
	var options=config.options;
	if(caching_enabled){
		if(server_type=='memcached'){
			var Memcache=require('./cache/memcache.js').Memcache;
			obj = new Memcache(server,options);
		}
	}

	function get(key,callback){
		obj.get(key,callback);
	}
	function set(key,data,lifetime,callback){
		obj.set(key,data,lifetime,callback);
	}
	this.get=get;
	this.set=set;
	this.del=function(key,callback){
		obj.del(key,callback);
	}

	this.fetch=function(key,lifetime,fetch_value_func,callback){
		if(caching_enabled)
			get(key,function(err,data){
				if(err || !data || data==undefined)
					fetch_value_func(function(err,search_data){
						if(err)
							callback(err);
						else{
							set(key,search_data,lifetime,function(err,search_data1){});
							callback(null,search_data);
						}
					});
				else{
					logger.verbose("Cache HIT : "+key);
					callback(null,data);
				}
			});	
		else
			fetch_value_func(callback);
	}
}


module.exports=Cache;