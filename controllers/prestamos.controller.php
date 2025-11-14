<?php
/* CONTROLADOR DE PRÉSTAMOS */

//error_reporting(0); 
require_once('../models/prestamos.models.php');

$prestamo = new Prestamos_Model();

switch($_GET["op"]){
    
    case "todos":
        $datos = $prestamo->todos(); 
        $todos = array();
        while($fila = mysqli_fetch_assoc($datos)){
            $todos[] = $fila;
        }      
        echo json_encode($todos);
        break;

    case "uno":
        $idprestamo = $_POST["idprestamo"];     
        $datos = $prestamo->uno($idprestamo);
        $uno = mysqli_fetch_assoc($datos);       
        echo json_encode($uno);
        break;

    case "insertar":
        $idusuario = $_POST["idusuario"];
        $idlibro = $_POST["idlibro"];
        $resultado = $prestamo->insertar($idusuario, $idlibro);
        echo json_encode($resultado); 
        break;

    case "devolver":
        $idprestamo = $_POST["idprestamo"];
        $pfechadevolucion = $_POST["pfechadevolucion"]; 
        $resultado = $prestamo->registrar_devolucion($idprestamo, $pfechadevolucion);      
        echo json_encode($resultado); 
        break;

    default:
        break;
}
?>