const express = require('express');
const mongodb = require('mongodb');
const app = express();
let MongoClient = mongodb.MongoClient;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
let db;
MongoClient.connect(
	'mongodb://127.0.0.1:27017',
	{ useNewUrlParser: true, useUnifiedTopology: true },
	function (err, client) {
		err ? console.log(err) : (app.locals.db = client.db('Restaurants'));
	}
);
console.log(app.locals.db)
app.get('/api/menus', function (req, res) {
	db.collection('Menus')
		.find()
		.toArray(function (error, datos) {
			if (error !== null) {
				res.send({ error: true, mensaje: err });
			} else {
				res.send({ error: false, datos });
			}
		});
});

app.post('/api/nuevoMenu', function (req, res) {
	db.collection('Menus').insertOne(
		{
			Numero_de_menu: parseInt(req.body.Numero_de_menu),
			Primer_plato: req.body.Primer_plato,
			Segundo_plato: req.body.Segundo_plato,
			Postre: req.body.Postre,
			Precio: parseInt(req.body.Precio),
		},
		function (error, datos) {
			if (error !== null) {
				console.log(error);
				res.send({ error: true, mensaje: error });
			} else {
				res.send({ error: false, mensaje: datos });
			}
		}
	);
});
app.put(`/api/editarMenu`, function (req, res) {
	db.collection('Menus').updateOne(
		{ Numero_de_menu: parseInt(req.body.Numero_de_menu) },
		{
			$set: {
				Primer_plato: req.body.Primer_plato,
				Segundo_plato: req.body.Segundo_plato,
				Postre: req.body.Postre,
				Precio: parseInt(req.body.Precio),
			},
		},
		function (error, datos) {
			error ? res.send({ error: true, contenido: error }) : res.send({ error: false, contenido: datos });
		}
	);
});
/* app.delete(`/api/borrarMenu`, function (req, res) {
	db.collection('Menus').deleteOne({ Numero_de_menu: parseInt(req.body.Numero_de_menu) }, function (error, datos) {
		error ? res.send({ error: true, contenido: error }) : res.send({ error: false, contenido: datos });
	});
}); */

app.delete('/api/borrarMenu/:menu', function (req, res) {
	db.collection('menus').deleteOne({ Numero_de_menu: req.params.menu }, function (error, datos) {
		error ? res.send({ error: true, contenido: error }) : res.send({ error: false, contenido: datos });
	});
});
app.listen(process.env.PORT || 3000);
