<?php
/* CONTROLADOR DE USUARIOS */

//error_reporting(0); 
require_once('../models/usuarios.models.php');

$usuario = new Usuario_Model();

switch($_GET["op"]){

    case "todos":
        $datos = array();
        $datos = $usuario->todos();
        $todos = array(); 
        while($fila = mysqli_fetch_assoc($datos)){
            $todos[] = $fila;
        }
        echo json_encode($todos);
        break;

    case "uno":
        $idusuario = $_POST["idusuario"]; 
        
        $datos = array();
        $datos = $usuario->uno($idusuario);
        $uno = mysqli_fetch_assoc($datos);
        
        echo json_encode($uno);
        break;

    case "insertar":
        $nombre = $_POST["unombre"];  
        $telefono = $_POST["utelefono"]; 

        $datos = array();
        $datos = $usuario->insertar($nombre, $telefono);
        
        echo json_encode($datos);
        break;

    case "actualizar":
        $idusuario = $_POST["idusuario"]; 
        $nombre = $_POST["unombre"];    
        $telefono = $_POST["utelefono"]; 

        $datos = array();
        $datos = $usuario->actualizar($idusuario, $nombre, $telefono);
        echo json_encode($datos);
        break;
    
    default:
    break;
}
?>