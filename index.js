const express=require('express');
const cors = require('cors');
const movies=require('./movies');
const path=require('path');
const app=express();
const idFilter = req => member => member.id === parseInt(req.params.id);

// Body Parser Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));
app.use(cors());

const PORT =  3000;

app.listen(PORT, () => console.log(`Server is Running ${PORT}`));


//GET All MOVIES

app.get('/api/movies',(req,res)=>res.json(movies));

//GET Specific MOVIE Based on ID

app.get('/api/movies/:id', (req, res) => {

const found = movies.some(idFilter(req));

if (found) {
res.json(movies.filter(idFilter(req)));
} else {
res.status(400).json({ msg: `No movie with the id of ${req.params.id}` });
}

});


//CREATE A NEW MOVIE

app.post('/api/movies',(req,res)=>{

const newMovie={

id: movies.length + 1,
name: req.body.name,
year_of_release: req.body.year_of_release,
main_lead: req.body.main_lead,
director: req.body.director,
ratings: req.body.ratings

};

if(!newMovie.name || !newMovie.director){
return res.status(400).json({msg:'Title and Director details must be provided'});
}

movies.push(newMovie);
res.json(movies);
}

);

//DELETE Specific MOVIE Based on ID

app.delete('/api/movies/:id', (req, res) => {

const found = movies.some(idFilter(req));

if (found) {
res.json({msg:'Deleted',
members:movies.filter(
member=>member.id!==parseInt(req.params.id))})
} else {
res.status(400).json({ msg: `No movies with the id of ${req.params.id}` });
}

});

//UPDATE Specific Movie Based on ID

app.put('/api/movies:id',(req,res)=>

{
const found = movies.some(member=>member.id===parseInt(req.params.id));

if(found)
{
const updMovie=req.body;
movies.forEach(
movie=>{
if(movie.id===parseInt(req.params.id))
{
    movie.name=updMovie ? updMovie.name : movie.name;
    movie.year_of_release=updMovie.year_of_release ? updMovie.year_of_release : movie.year_of_release;
    movie.main_lead=updMovie.main_lead ? updMovie.main_lead : movie.main_lead;
    movie.director=updMovie.director ? updMovie.director : movie.director;
    movie.ratings=updMovie.ratings ? updMovie.ratings : movie.ratings;
    
res.json({msg:'Updated Details',movie})
}
}

);

}
else{
res.status(400).json({msg:'No movie found with ${req.params.id}'});
}

});