class Libros {
    constructor(baseUrl) {
        this.baseUrl = baseUrl + 'libros.controller.php';
        this.container = $('#contenido-dinamico');
        this.tituloArea = $('#titulo-area');
    }

    //cargar la tabla

    cargarTabla() {
        this.tituloArea.text('Gestor de Libros');

        $.ajax({
            url: this.baseUrl + '?op=todos',
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                this.renderizarTabla(data);
            },
            error: (xhr, status, error) => {
                this.container.html('<p class="alert alert-danger">Error al cargar Libros.</p>');
            }
        });
    }

    // renderizar tabla

    renderizarTabla(libros) {
        let html = `
            <button class="btn btn-success mb-3" id="btn-nuevo-libro">
                <i class="fas fa-book-medical"></i> Insertar Nuevo Libro
            </button>
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        libros.forEach(libro => {
            html += `
                <tr>
                    <td>${libro.idlibro}</td>
                    <td>${libro.lnombre}</td>
                    <td>${libro.lautor}</td>
                    <td>
                        <button class="btn btn-sm btn-warning btn-editar-libro" data-id="${libro.idlibro}">Editar</button>
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
        $('#btn-nuevo-libro').on('click', () => {
            this.renderizarFormulario({}); 
        });

        $('.btn-editar-libro').on('click', (e) => { 
            const id = $(e.currentTarget).data('id'); 
            this.editarLibro(id); 
        });
    }

    //formulario

    renderizarFormulario(libro = {}) {
        const isEditing = libro.idlibro !== undefined;
        const title = isEditing ? 'Editar Libro ID: ' + libro.idlibro : 'Insertar Nuevo Libro';
        const btnText = isEditing ? 'Guardar Cambios' : 'Registrar Libro';

        let html = `
            <h2>${title}</h2>
            <a href="#" class="btn btn-secondary mb-3" id="btn-volver-libros">← Volver al Listado</a>
            <form id="formulario-libro">
                <input type="hidden" id="idlibro" name="idlibro" value="${libro.idlibro || ''}">
                
                <div class="mb-3">
                    <label for="lnombre" class="form-label">Título</label>
                    <input type="text" class="form-control" id="lnombre" name="lnombre" 
                           value="${libro.lnombre || ''}" required>
                </div>
                
                <div class="mb-3">
                    <label for="lautor" class="form-label">Autor</label>
                    <input type="text" class="form-control" id="lautor" name="lautor" 
                           value="${libro.lautor || ''}" required>
                </div>
                
                <button type="submit" class="btn btn-primary" id="btn-guardar-libro">
                    ${btnText}
                </button>
            </form>
        `;

        this.container.html(html);
        this.handleFormSubmit();

        $('#btn-volver-libros').on('click', (e) => {
            e.preventDefault();
            this.cargarTabla();
        });
    }

    //editar el libro

    editarLibro(id) {
        $.ajax({
            url: this.baseUrl + '?op=uno',
            type: 'POST',
            data: { idlibro: id }, 
            dataType: 'json',
            success: (data) => {
                if (data && data.idlibro) {
                    this.renderizarFormulario(data);
                } else {
                    alert('No se encontraron datos para el ID del libro: ' + id);
                }
            },
            error: (xhr, status, error) => {
                console.error("Error al obtener datos del libro ID " + id + ":", error);
                alert('Error al cargar los datos de edición.');
            }
        });
    }

    //lógica de envío

    handleFormSubmit() {
        $('#formulario-libro').on('submit', (e) => {
            e.preventDefault();

            const idlibro = $('#idlibro').val();
            const operation = idlibro ? 'actualizar' : 'insertar';
            const urlController = this.baseUrl + '?op=' + operation;

            let postData = {
                lnombre: $('#lnombre').val(),
                lautor: $('#lautor').val(),
            };

            if (idlibro) {
                postData.idlibro = idlibro;
            }

            $.post(urlController, postData, (response) => {
                const success = (response === true || response === 1);

                if (success) {
                    alert(`Libro ${operation === 'insertar' ? 'registrado' : 'actualizado'} con éxito.`);
                    this.cargarTabla(); 
                } else {
                    alert(`Error al ${operation === 'insertar' ? 'insertar' : 'actualizar'} el libro. Respuesta: ${response}`);
                }
            }, 'json').fail(() => {
                alert("Error de conexión o respuesta no JSON.");
            });
        });
    }
}