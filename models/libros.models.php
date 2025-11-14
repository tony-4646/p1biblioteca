<?php
/* CRUD DE LIBROS*/

require_once('../config/conexion.php');

class Libro_Model {


    public function todos() {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "SELECT * FROM libros";
        $stmt = $con->prepare($cadena);
        $stmt->execute();
        $datos = $stmt->get_result(); 
        $con->close();
        return $datos; 
    }

    public function uno($idlibro) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "SELECT * FROM libros WHERE idlibro = ?";
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('i', $idlibro); 
        $stmt->execute();
        $datos = $stmt->get_result();
        $con->close();
        return $datos; 
    }

    public function insertar($nombre, $autor) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();     
        $cadena = "INSERT INTO libros(lnombre, lautor) VALUES (?, ?)"; 
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('ss', $nombre, $autor);
        $resultado = $stmt->execute();
        $con->close();  
        return $resultado; 
    }


    public function actualizar($idlibro, $nombre, $autor) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "UPDATE libros SET lnombre = ?, lautor = ? WHERE idlibro = ?";     
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('ssi', $nombre, $autor, $idlibro); 
        $resultado = $stmt->execute();
        $con->close();
        return $resultado; 
    }
}
?>