import React, { useEffect, useState } from "react";
import * as API from '../../servicios/servicios'
import { Menu } from "../../Menu";
import Swal from 'sweetalert2' 


export function Usuarios(){
    const [usuarios, setUsuarios]=useState([])
    const [id_usuario, setIdUsuarios]=useState('')
    const [mensaje, setMensaje] = useState('')
    const [nombre, setNombre] = useState('')

    const toastTrigger = document.getElementById('liveToastBtn')
    const toastLiveExample = document.getElementById('liveToast')
    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastTrigger.addEventListener('click', () => {
          toastBootstrap.show()
        })
      }
    const guardarUsuario = async(event)=>{
        event.preventDefault();
        if(id_usuario){
            const respuesta = await API.EditUsuario({nombre}, id_usuario)
    
            if(respuesta.status){
                setMensaje(respuesta.mensaje)
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
                toastBootstrap.show()
                setTimeout(()=>{
                    setMensaje('')
                    window.location.href='/usuarios'
                    // API.getUsuarios().then(setUsuarios)
                    }, 2500)
            }
            return;
        }else{
            const respuesta = await API.AddUsuario({nombre})
            if(respuesta.status){
                setMensaje(respuesta.mensaje)
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
                toastBootstrap.show()
                setTimeout(()=>{
                    setMensaje('')
                    window.location.href='/usuarios'
                    // API.getUsuarios().then(setUsuarios)
                    }, 2500)
            }
            return;
        }
        
    }
    
    useEffect(()=>{
        API.getUsuarios().then(setUsuarios)
    }, [])

    const cambiar_estado = async (e, id_usuario, estado_actual)=>{
        e.preventDefault();
        const actualizar = (estado_actual=="A")?"B":"A";
        const mjs = (estado_actual=="A")?"dar de baja":"dar de alta";
        Swal.fire({
            title: 'Esta seguro?',
            text: "Usted esta a punto de "+mjs+" a un usuario!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No, deja nomas',
            confirmButtonText: 'Si, ya te dije que si!'
          }).then((result) => {
            if (result.isConfirmed) {
                
                API.ActualizarEstadoUsuario(id_usuario, {actualizar})
                .then((respuesta) => {
                    if(respuesta.status){
                        setMensaje(respuesta.mensaje)
                        API.getUsuarios().then(setUsuarios)
                        Swal.fire(
                            'Correcto!',
                            mensaje,
                            'success'
                          )   
                    }
             
                })
            }
        })
        
        
    }

    const editar_registro = async (e, id_usuario)=>{
        e.preventDefault();
        
        setIdUsuarios(id_usuario)
        const datos_usuario= await API.getUsuariosByID(id_usuario);
        console.log(datos_usuario)
        setNombre(datos_usuario.nombre)
    }

    const resetPass = async (e, id_usuario)=>{
        e.preventDefault();
        console.log('mi id_usuario es -->',id_usuario)
        console.log(id_usuario)
        Swal.fire({
            title: 'Esta seguro?',
            text: "Usted esta a punto de blanquear el password de un usuario!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No ',
            confirmButtonText: 'Si, estoy segguro!'
          }).then((result) => {
            if (result.isConfirmed) {
                console.log('mi id_usuario es-->',id_usuario)
                API.ResetUsuariosByID(id_usuario)
                .then((respuesta) => {
                    console.log(respuesta)
                    if(respuesta.status){
                        setMensaje(respuesta.mensaje)
                        API.getUsuarios().then(setUsuarios)
                        Swal.fire(
                            'Exito!',
                            mensaje,
                            'success'
                          )
                        
                        
                            
                           
                           
                    }
             
                })
            }
        })

        const datos_usuario= await API.ResetUsuariosByID(id_usuario);
    
    }


    return(
        <>
        
        <Menu/>
        <table class="table table-striped">
        <thead>
            <tr>
                
                <th colspan="6">
                
                <button  class="btn btn-outline-primary  btn-sm"  data-bs-toggle="modal"  data-bs-target="#exampleModal" ><i class="bi bi-database-add"></i>Agregar</button>
                &nbsp;
                
                <input  type="checkbox"/>Solo Activos
                </th>    
            </tr>

            <tr>
                <td>Apellido y Nombre</td>
                <td>Nick</td>
                <td>Rol</td>
                <td>Correo</td>
                <td>Estado</td>
                <td colspan="2">Acciones</td>
            </tr>
            </thead>
            <tbody>
            {usuarios.map((usuario)=>(
                <tr>
                <td >{usuario.apellido} {usuario.nombre}</td>    
                <td >{usuario.user}</td>
                <td >{usuario.rol}</td>
                <td >{usuario.correo}</td>
                <td >{usuario.estado}</td>
                <td >
                {(usuario.estado=="A")?
                <button   data-bs-toggle="modal"  data-bs-target="#exampleModal" onClick={(event)=>editar_registro(event, usuario.id_usuario)} class="btn btn-warning btn-sm"><i class="bi bi-pencil"></i>Editar</button>
                : 
                <button disabled class="btn btn-warning btn-sm">Editar</button>
                }
                {(usuario.estado=="A")?
                <button class="btn btn-danger btn-sm" onClick={(event)=>cambiar_estado(event, usuario.id_usuario, usuario.estado )} ><i class="bi bi-hand-thumbs-down-fill"></i>Desactivar</button>
                :
                <button class="btn btn-success btn-sm" onClick={(event)=>cambiar_estado(event, usuario.id_usuario, usuario.estado )} ><i class="bi bi-hand-thumbs-up-fill"></i>Activar</button>
                
                }
                
                <button onClick={(event)=>resetPass(event, usuario.id_usuario)} class="btn btn-dark btn-sm"><i class="bi bi-arrow-clockwise"></i>Reset Password</button>
                
               
                </td>
                </tr>
            ))}
            </tbody>
            
           
        </table>
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Datos del modelo </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form onSubmit={guardarUsuario}>
                <div class="modal-body">
                
                    
                    <div className="form-floating">
                    <input required
                    type="text" 
                    value={nombre}
                    onChange={(event)=>setNombre(event.target.value)}
                    className="form-control" 
                    placeholder="Nombre del usuarios"
                    />
                    <label for="floatingInput">Nombre del usuario</label>
                    </div>
                </div>
                <div class="modal-footer">
                <button className="btn btn-primary" type="submit" >Guardar</button>
                    
                </div>
                </form>
                </div>
            </div>
        </div>

        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                
                <strong class="me-auto">Mensaje</strong>
                
                
                </div>
                <div class="toast-body">
                {mensaje}
                </div>
            </div>
        </div>
        </>
    )
}