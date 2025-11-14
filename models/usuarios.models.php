<?php
/* CRUD DE USUARIOS*/

require_once('../config/conexion.php');

class Usuario_Model {


    public function todos() {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "SELECT * FROM usuarios";
        $stmt = $con->prepare($cadena);
        $stmt->execute();
        $datos = $stmt->get_result(); 
        $con->close();
        return $datos; 
    }

    public function uno($idusuario) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "SELECT * FROM usuarios WHERE idusuario = ?";
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('i', $idusuario); 
        $stmt->execute();
        $datos = $stmt->get_result();
        $con->close();
        return $datos; 
    }

    public function insertar($nombre, $telefono) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();     
        $cadena = "INSERT INTO usuarios(unombre, utelefono) VALUES (?, ?)"; 
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('ss', $nombre, $telefono);
        $resultado = $stmt->execute();
        $con->close();  
        return $resultado; 
    }


    public function actualizar($idusuario, $nombre, $telefono) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "UPDATE usuarios SET unombre = ?, utelefono = ? WHERE idusuario = ?";     
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('ssi', $nombre, $telefono, $idusuario); 
        $resultado = $stmt->execute();
        $con->close();
        return $resultado; 
    }
}
?>