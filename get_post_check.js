// define express app
let express = require('express');
let app = express();

// initialize dependencies
let handlebars = require('express-handlebars').create({defaultLayout:'main'});
let bodyParser = require('body-parser');

// set up handlers for POST requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// set up templating system for displaying content
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

// all content in this app is loaded from the default '/' page
app.get('/',function(req,res){
    // only display GET requests if data has been retrieved
    if (!(Object.entries(req.query).length === 0 && req.query.constructor === Object)) {
        // I did NOT copy/paste this code, however, after studying this week's lectures
        // this approach really seems to make the most sense!
        let queryParms = [];
        for (let parm in req.query) {
            queryParms.push({'key':parm, 'value':req.query[parm]});
        }
        let context = {};
        context.data = queryParms;
        res.render('get', context);
    } else {
        // default page to render if no data is present
        res.render('home');
    }
});

// post data is only visible in rest client as far as I can tell
app.post('/',function(req,res){
    // handling POST requests is really the same as GET requests
    // aside from setting up bodyparser
    let queryParms = [];
    for (let parm in req.body) {
        queryParms.push({'key':parm, 'value':req.body[parm]});
    }
    let context = {};
    context.data = queryParms;
    res.render('post', context);
});

// error handling
app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

// notifications
app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
