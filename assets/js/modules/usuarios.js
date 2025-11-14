class Usuarios {
    constructor(baseUrl) {
        this.baseUrl = baseUrl + 'usuarios.controller.php';
        this.container = $('#contenido-dinamico');
        this.tituloArea = $('#titulo-area');
    }

    // tabla 

    cargarTabla() {
        this.tituloArea.text('Gestor de Usuarios');

        $.ajax({
            url: this.baseUrl + '?op=todos',
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                this.renderizarTabla(data);
            },
            error: (xhr, status, error) => {
                this.container.html('<p class="alert alert-danger">Error al cargar Usuarios.</p>');
            }
        });
    }

    //renderizar tabla

    renderizarTabla(usuarios) {
        let html = `
            <button class="btn btn-success mb-3" id="btn-nuevo-usuario">
                <i class="fas fa-user-plus"></i> Insertar Nuevo Usuario
            </button>
            <table class="table table-striped table-hover">
                <thead>
                    <tr><th>ID</th><th>Nombre</th><th>Teléfono</th><th>Acciones</th></tr>
                </thead>
                <tbody>
        `;

        usuarios.forEach(usuario => {
            html += `
                <tr>
                    <td>${usuario.idusuario}</td>
                    <td>${usuario.unombre}</td>
                    <td>${usuario.utelefono}</td>
                    <td>
                        <button class="btn btn-sm btn-warning btn-editar" data-id="${usuario.idusuario}">Editar</button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;

        this.container.html(html);
        this.attachTableEvents();
    }

    //eventos de tabla

    attachTableEvents() {
        $('#btn-nuevo-usuario').on('click', () => {
            this.renderizarFormulario({});
        });

        $('.btn-editar').on('click', (e) => {
            const id = $(e.currentTarget).data('id');
            this.editarUsuario(id);
        });
    }

    // renderizar formulario

    renderizarFormulario(usuario = {}) {
        const isEditing = usuario.idusuario !== undefined;
        const title = isEditing ? 'Editar Usuario ID: ' + usuario.idusuario : 'Insertar Nuevo Usuario';
        const btnText = isEditing ? 'Guardar Cambios' : 'Registrar Usuario';

        let html = `
            <h2>${title}</h2>
            <a href="#" class="btn btn-secondary mb-3" id="btn-volver-usuarios">← Volver al Listado</a>
            <form id="formulario-usuario">
                <input type="hidden" id="idusuario" name="idusuario" value="${usuario.idusuario || ''}">
                
                <div class="mb-3">
                    <label for="unombre" class="form-label">Nombre Completo</label>
                    <input type="text" class="form-control" id="unombre" name="unombre" 
                           value="${usuario.unombre || ''}" required>
                </div>
                
                <div class="mb-3">
                    <label for="utelefono" class="form-label">Teléfono</label>
                    <input type="tel" class="form-control" id="utelefono" name="utelefono" 
                           value="${usuario.utelefono || ''}" required>
                </div>
                
                <button type="submit" class="btn btn-primary" id="btn-guardar-usuario">
                    ${btnText}
                </button>
            </form>
        `;

        this.container.html(html);
        this.handleFormSubmit();

        $('#btn-volver-usuarios').on('click', (e) => {
            e.preventDefault();
            this.cargarTabla();
        });
    }

    //editar usuario

    editarUsuario(id) {
        $.ajax({
            url: this.baseUrl + '?op=uno',
            type: 'POST',
            data: { idusuario: id },
            dataType: 'json',
            success: (data) => {
                if (data && data.idusuario) {
                    this.renderizarFormulario(data);
                } else {
                    alert('No se encontraron datos para el ID del usuario: ' + id);
                }
            },
            error: (xhr, status, error) => {
                console.error("Error al obtener datos del usuario ID " + id + ":", error);
                alert('Error al cargar los datos de edición.');
            }
        });
    }


    //envío

    handleFormSubmit() {
        $('#formulario-usuario').on('submit', (e) => {
            e.preventDefault();

            const idusuario = $('#idusuario').val();
            const operation = idusuario ? 'actualizar' : 'insertar';
            const urlController = this.baseUrl + '?op=' + operation;

            let postData = {
                unombre: $('#unombre').val(),
                utelefono: $('#utelefono').val()
            };

            if (idusuario) {
                postData.idusuario = idusuario;
            }

            $.post(urlController, postData, (response) => {
                const success = (response === true || response === 1);

                if (success) {
                    alert(`Usuario ${operation === 'insertar' ? 'registrado' : 'actualizado'} con éxito.`);
                    this.cargarTabla();
                } else {
                    alert(`Error al ${operation === 'insertar' ? 'insertar' : 'actualizar'} el usuario. Respuesta: ${response}`);
                }
            }, 'json').fail(() => {
                alert("Error de conexión o respuesta no JSON.");
            });
        });
    }
}