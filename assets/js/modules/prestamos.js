class Prestamos {
    constructor(baseUrl) {
        this.baseUrl = baseUrl + 'prestamos.controller.php';
        this.container = $('#contenido-dinamico');
        this.tituloArea = $('#titulo-area');
    }

    //tabla

    cargarTabla() {
        this.tituloArea.text('Gestor de Préstamos');

        $.ajax({
            url: this.baseUrl + '?op=todos',
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                this.renderizarTabla(data);
            },
            error: (xhr, status, error) => {
                this.container.html('<p class="alert alert-danger">Error al cargar Préstamos.</p>');
            }
        });
    }

    //carga de datos en el formulario

    cargarDatosFormulario() {
        this.tituloArea.text('Registrar Nuevo Préstamo');
        this.container.html('<p>Cargando usuarios y libros...</p>');

        const usuariosReq = $.ajax({
            url: this.baseUrl.replace('prestamos', 'usuarios') + '?op=todos',
            type: 'GET',
            dataType: 'json'
        });

        const librosReq = $.ajax({
            url: this.baseUrl.replace('prestamos', 'libros') + '?op=todos',
            type: 'GET',
            dataType: 'json'
        });

        $.when(usuariosReq, librosReq)
            .done((usuariosRes, librosRes) => {
                const usuarios = usuariosRes[0];
                const libros = librosRes[0];

                this.renderizarFormulario(usuarios, libros);
            })
            .fail((...errors) => {
                console.error("Error al cargar datos para el formulario de préstamo:", errors);
                this.container.html('<p class="alert alert-danger">Error al cargar listas de Usuarios o Libros.</p>');
            });
    }

    // renderizado de tabla

    renderizarTabla(prestamos) {
        let html = `
            <button class="btn btn-success mb-3" id="btn-nuevo-prestamo">
                <i class="fas fa-hand-holding"></i> Registrar Nuevo Préstamo
            </button>
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Libro</th>
                        <th>Fecha Préstamo</th>
                        <th>Fecha Devolución</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        prestamos.forEach(prestamo => {
            const fechaDevolucion = prestamo.pfechadevolucion;
            const isActivo = fechaDevolucion === null || fechaDevolucion === '0000-00-00' || fechaDevolucion === '';

            const estado = isActivo ? "ACTIVO" : "DEVUELTO";
            const claseEstado = isActivo ? "text-success" : "text-secondary";
            const fechaDevolucionDisplay = isActivo ? 'PENDIENTE' : fechaDevolucion;

            html += `
                <tr>
                    <td>${prestamo.idprestamo}</td>
                    <td>${prestamo.unombre}</td>
                    <td>${prestamo.lnombre}</td>
                    <td>${prestamo.pfechaprestamo}</td>
                    <td class="${claseEstado}">${fechaDevolucionDisplay}</td>
                    <td><span class="${claseEstado}">o ${estado}</span></td>
                    <td>
                        ${isActivo
                    ? `<button class="btn btn-sm btn-primary btn-devolver" data-id="${prestamo.idprestamo}">Devolver</button>`
                    : ``
                }
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
        $('#btn-nuevo-prestamo').on('click', () => {
            this.cargarDatosFormulario();
        });

        $('.btn-devolver').on('click', (e) => {
            const id = $(e.currentTarget).data('id');
            this.handleDevolucion(id);
        });
    }

    //devolución

    handleDevolucion(idprestamo) {
        const fechaDevolucion = new Date().toISOString().slice(0, 10);

        if (confirm(`¿Desea devolver este libro?`)) {
            const urlController = this.baseUrl + '?op=devolver';

            $.post(urlController, {
                idprestamo: idprestamo,
                pfechadevolucion: fechaDevolucion
            }, (response) => {
                const success = (response === true || response === 1);

                if (success) {
                    alert("Devolución realizada con éxito");
                    this.cargarTabla();
                } else {
                    alert(`Error al realizar la devolución. ${response}`);
                }
            }, 'json').fail(() => {
                alert("Error de conexión con el servidor.");
            });
        }
    }

// vista del formulario

    renderizarFormulario(usuarios, libros) {
        let usuariosOptions = usuarios.map(u =>
            `<option value="${u.idusuario}">${u.unombre}</option>`
        ).join('');

        let librosOptions = libros.map(l =>
            `<option value="${l.idlibro}">${l.lnombre} (Autor: ${l.lautor})</option>`
        ).join('');

        let today = new Date().toISOString().slice(0, 10);

        let html = `
        <h2>Registrar Nuevo Préstamo</h2>
        <a href="#" class="btn btn-secondary mb-3" id="btn-volver-prestamos">← Volver al Listado</a>
        <form id="formulario-prestamo">
            
            <div class="mb-3">
                <label for="idusuario" class="form-label">Seleccionar Usuario</label>
                <select class="form-control" id="idusuario" name="idusuario" required>
                    <option value="">Seleccione un usuario...</option>
                    ${usuariosOptions}
                </select>
            </div>
            
            <div class="mb-3">
                <label for="idlibro" class="form-label">Seleccionar Libro</label>
                <select class="form-control" id="idlibro" name="idlibro" required>
                    <option value="">Seleccione un libro...</option>
                    ${librosOptions}
                </select>
            </div>
            
            <button type="submit" class="btn btn-primary" id="btn-guardar-prestamo">
                Registrar Préstamo
            </button>
        </form>
    `;

        this.container.html(html);
        this.handleFormSubmit();

        $('#btn-volver-prestamos').on('click', (e) => {
            e.preventDefault();
            this.cargarTabla();
        });
    }

    //lógica de envío

    handleFormSubmit() {
        $('#formulario-prestamo').on('submit', (e) => {
            e.preventDefault();

            const urlController = this.baseUrl + '?op=insertar';

            let postData = {
                idusuario: $('#idusuario').val(),
                idlibro: $('#idlibro').val(),
                pfechaprestamo: $('#pfechaprestamo').val()
            };

            $.post(urlController, postData, (response) => {
                const success = (response === true || response === 1);

                if (success) {
                    alert("Préstamo realizado con éxito.");
                    this.cargarTabla(); 
                } else {
                    alert(`Error al registrar el préstamo. Respuesta: ${response}`);
                }
            }, 'json').fail(() => {
                alert("El libro ya ha sido prestado, seleccione otro.");
            });
        });
    }
}