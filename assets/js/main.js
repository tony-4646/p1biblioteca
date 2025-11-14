
$(document).ready(function() {
    
    const BASE_URL = '/p1biblioteca/controllers/';
    const usuariosModule = new Usuarios(BASE_URL);
    const librosModule = new Libros(BASE_URL);
    const prestamosModule = new Prestamos(BASE_URL);
    
    $('#btn-usuarios').on('click', function(e) {
        e.preventDefault();
        usuariosModule.cargarTabla(); 
    });

    $('#btn-libros').on('click', function(e) {
        e.preventDefault();
        librosModule.cargarTabla();
    });
    
    $('#btn-prestamos').on('click', function(e) {
        e.preventDefault();
        prestamosModule.cargarTabla();
    });

});