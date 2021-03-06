var express = require('express');

var app = express();
app.set('port', (process.env.PORT || 8080));

var pokeAPI = require('pokenode');


require('node-jsx').install();
var path = require('path');

var renderer = require('react-engine');
// create the view engine with `react-engine`
var engine = renderer.server.create({
    reactRoutes: path.join(__dirname + '/public/routes.jsx')
});

// set the engine
app.engine('.jsx', engine);
// app.engine('.js', engine);

// set the view directory
app.set('views', __dirname + '/public/views');

// set js as the view engine
app.set('view engine', 'jsx');

// finally, set the custom view
app.set('view', renderer.expressView);

//expose public folder as static assets
app.use(express.static(__dirname + '/public'));



function index(req, res) {
    // console.log()
    res.render(req.url, {
        title: 'Server Render index',
        name: 'Hola mundo'
    });


}
function pokemon(req, res){
    pokeAPI.pokemon(req.params.id, function(err, data) {
        if(err) {
            res.render('404', {
                title : "Pokemon no encontrado :(",
            });
    
        } else {
            if(req.xhr){
                res.json(data)
            }else{
                res.render(req.url, {
                    title : "Pokemon encontrado :)",
                    pokemon : data,
                });
            }
        }
    });
}

app.get('/', index);


app.get('/pokemon/:id', pokemon);


app.listen(app.get('port'), function(){
    console.log('node está corriendo en el puerto '+app.get('port'));
});