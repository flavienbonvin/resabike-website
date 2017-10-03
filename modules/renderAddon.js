var self = module.exports = {
    readableObject(data) {
        var html = '<ul>';
        for(var label in data){
            if(typeof data[label] == 'object'){
                html+="<li>"+label;
                html+=self.readableObject(data[label]);
                html+"</li>";
            }else{
                html+="<li>"+label+" => "+data[label]+"</li>";
            }
        }

        html+='</ul>';
        return html;
    }

}