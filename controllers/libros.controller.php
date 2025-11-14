<?php
/* CONTROLADOR DE LIBROS */

//error_reporting(0); 
require_once('../models/libros.models.php');

$libro = new Libro_Model();

switch($_GET["op"]){

    case "todos":
        $datos = array();
        $datos = $libro->todos();
        $todos = array(); 
        while($fila = mysqli_fetch_assoc($datos)){
            $todos[] = $fila;
        }
        echo json_encode($todos);
        break;

    case "uno":
        $idlibro = $_POST["idlibro"]; 
        
        $datos = array();
        $datos = $libro->uno($idlibro);
        $uno = mysqli_fetch_assoc($datos);
        
        echo json_encode($uno);
        break;

    case "insertar":
        $nombre = $_POST["lnombre"];  
        $autor = $_POST["lautor"]; 

        $datos = array();
        $datos = $libro->insertar($nombre, $autor);
        
        echo json_encode($datos);
        break;

    case "actualizar":
        $idlibro = $_POST["idlibro"]; 
        $nombre = $_POST["lnombre"];    
        $autor = $_POST["lautor"]; 

        $datos = array();
        $datos = $libro->actualizar($idlibro, $nombre, $autor);
        echo json_encode($datos);
        break;

    default:
    break;
}
?>