<?php
/* CRUD DE PRESTAMOS*/

require_once('../config/conexion.php');

class Prestamos_Model {

    public function todos() {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        
        $cadena = "SELECT 
                        P.idprestamo, 
                        U.unombre, 
                        L.lnombre, 
                        P.pfechaprestamo, 
                        P.pfechadevolucion
                   FROM prestamos P
                   INNER JOIN usuarios U ON P.idusuario = U.idusuario
                   INNER JOIN libros L ON P.idlibro = L.idlibro";                  
        $stmt = $con->prepare($cadena);
        $stmt->execute();
        $datos = $stmt->get_result();
        $con->close();
        return $datos; 
    }

    public function uno($idprestamo) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        
        $cadena = "SELECT 
                        P.idprestamo, 
                        U.unombre, 
                        L.lnombre, 
                        P.pfechaprestamo, 
                        P.pfechadevolucion
                   FROM prestamos P
                   INNER JOIN usuarios U ON P.idusuario = U.idusuario
                   INNER JOIN libros L ON P.idlibro = L.idlibro
                   WHERE P.idprestamo = ?";
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('i', $idprestamo);
        $stmt->execute();
        $datos = $stmt->get_result(); 
        $con->close();
        return $datos; 
    }
    
    public function insertar($idusuario, $idlibro) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();

        $cadena = "INSERT INTO prestamos(idusuario, idlibro, pfechaprestamo) VALUES (?, ?, CURDATE())";
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('ii', $idusuario, $idlibro);
        $resultado = $stmt->execute();
        $con->close();
        return $resultado; 
    }

    public function registrar_devolucion($idprestamo, $pfechadevolucion) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        
        $cadena = "UPDATE prestamos SET pfechadevolucion = ? WHERE idprestamo = ?";     
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('si', $pfechadevolucion, $idprestamo); 
        $resultado = $stmt->execute();
        $con->close();
        return $resultado;
    }
}
?>